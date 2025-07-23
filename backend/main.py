import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, session
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from flask_cors import CORS
from src.models.user import db
from src.models.workspace import User, WorkspaceSession, MeetingRoom, MeetingParticipant
from src.routes.user import user_bp
from src.routes.workspace import workspace_bp
from datetime import datetime
import uuid
import json

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, supports_credentials=True)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(workspace_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# In-memory storage for active connections
active_connections = {}
room_participants = {}

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Socket.IO Event Handlers
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'status': 'Connected to MetaWorkspace'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    
    # Remove from active connections
    if request.sid in active_connections:
        user_data = active_connections[request.sid]
        
        # Update database
        workspace_session = WorkspaceSession.query.filter_by(
            session_id=user_data.get('session_id')
        ).first()
        if workspace_session:
            db.session.delete(workspace_session)
            db.session.commit()
        
        # Remove from room participants
        current_room = user_data.get('current_room', 'main')
        if current_room in room_participants:
            room_participants[current_room].discard(request.sid)
        
        del active_connections[request.sid]
        
        # Notify other users
        emit('user_disconnected', {
            'user_id': user_data.get('user_id'),
            'session_id': user_data.get('session_id')
        }, broadcast=True, include_self=False)

@socketio.on('join_workspace')
def handle_join_workspace(data):
    user_id = data.get('user_id')
    session_id = data.get('session_id', str(uuid.uuid4()))
    position = data.get('position', {'x': 0, 'y': 0, 'z': 0})
    avatar_config = data.get('avatar_config', {})
    
    # Store connection info
    active_connections[request.sid] = {
        'user_id': user_id,
        'session_id': session_id,
        'current_room': 'main',
        'position': position,
        'avatar_config': avatar_config
    }
    
    # Join main room
    join_room('main')
    if 'main' not in room_participants:
        room_participants['main'] = set()
    room_participants['main'].add(request.sid)
    
    # Update or create workspace session in database
    user = User.query.get(user_id)
    if user:
        workspace_session = WorkspaceSession.query.filter_by(session_id=session_id).first()
        if not workspace_session:
            workspace_session = WorkspaceSession(
                user_id=user_id,
                session_id=session_id,
                position_x=position['x'],
                position_y=position['y'],
                position_z=position['z']
            )
            db.session.add(workspace_session)
        else:
            workspace_session.last_ping = datetime.utcnow()
            workspace_session.position_x = position['x']
            workspace_session.position_y = position['y']
            workspace_session.position_z = position['z']
        
        db.session.commit()
        
        # Notify other users
        emit('user_joined', {
            'user': user.to_dict(),
            'session_id': session_id,
            'position': position,
            'avatar_config': avatar_config
        }, room='main', include_self=False)
        
        # Send current users to the new user
        current_users = []
        for sid, conn_data in active_connections.items():
            if sid != request.sid and conn_data.get('current_room') == 'main':
                conn_user = User.query.get(conn_data.get('user_id'))
                if conn_user:
                    current_users.append({
                        'user': conn_user.to_dict(),
                        'session_id': conn_data.get('session_id'),
                        'position': conn_data.get('position'),
                        'avatar_config': conn_data.get('avatar_config')
                    })
        
        emit('workspace_state', {
            'users': current_users,
            'room': 'main'
        })

@socketio.on('update_position')
def handle_update_position(data):
    if request.sid not in active_connections:
        return
    
    position = data.get('position', {'x': 0, 'y': 0, 'z': 0})
    active_connections[request.sid]['position'] = position
    
    # Update database
    session_id = active_connections[request.sid].get('session_id')
    workspace_session = WorkspaceSession.query.filter_by(session_id=session_id).first()
    if workspace_session:
        workspace_session.position_x = position['x']
        workspace_session.position_y = position['y']
        workspace_session.position_z = position['z']
        workspace_session.last_ping = datetime.utcnow()
        db.session.commit()
    
    # Broadcast to other users in the same room
    current_room = active_connections[request.sid].get('current_room', 'main')
    emit('position_updated', {
        'session_id': session_id,
        'position': position
    }, room=current_room, include_self=False)

@socketio.on('update_status')
def handle_update_status(data):
    if request.sid not in active_connections:
        return
    
    status = data.get('status', 'available')
    active_connections[request.sid]['status'] = status
    
    # Update database
    session_id = active_connections[request.sid].get('session_id')
    workspace_session = WorkspaceSession.query.filter_by(session_id=session_id).first()
    if workspace_session:
        workspace_session.status = status
        workspace_session.last_ping = datetime.utcnow()
        db.session.commit()
    
    # Broadcast to other users
    current_room = active_connections[request.sid].get('current_room', 'main')
    emit('status_updated', {
        'session_id': session_id,
        'status': status
    }, room=current_room, include_self=False)

@socketio.on('join_meeting_room')
def handle_join_meeting_room(data):
    if request.sid not in active_connections:
        return
    
    room_id = data.get('room_id')
    user_id = active_connections[request.sid].get('user_id')
    
    # Leave current room
    current_room = active_connections[request.sid].get('current_room', 'main')
    leave_room(current_room)
    if current_room in room_participants:
        room_participants[current_room].discard(request.sid)
    
    # Join new room
    join_room(room_id)
    if room_id not in room_participants:
        room_participants[room_id] = set()
    room_participants[room_id].add(request.sid)
    
    active_connections[request.sid]['current_room'] = room_id
    
    # Update database
    session_id = active_connections[request.sid].get('session_id')
    workspace_session = WorkspaceSession.query.filter_by(session_id=session_id).first()
    if workspace_session:
        workspace_session.current_room = room_id
        workspace_session.last_ping = datetime.utcnow()
        db.session.commit()
    
    # Notify room participants
    user = User.query.get(user_id)
    if user:
        emit('user_joined_room', {
            'user': user.to_dict(),
            'session_id': session_id,
            'room_id': room_id
        }, room=room_id, include_self=False)
        
        # Send current room participants to the new user
        room_users = []
        for sid, conn_data in active_connections.items():
            if sid != request.sid and conn_data.get('current_room') == room_id:
                conn_user = User.query.get(conn_data.get('user_id'))
                if conn_user:
                    room_users.append({
                        'user': conn_user.to_dict(),
                        'session_id': conn_data.get('session_id')
                    })
        
        emit('room_state', {
            'users': room_users,
            'room_id': room_id
        })

@socketio.on('leave_meeting_room')
def handle_leave_meeting_room(data):
    if request.sid not in active_connections:
        return
    
    current_room = active_connections[request.sid].get('current_room')
    session_id = active_connections[request.sid].get('session_id')
    
    if current_room and current_room != 'main':
        # Leave current room
        leave_room(current_room)
        if current_room in room_participants:
            room_participants[current_room].discard(request.sid)
        
        # Notify room participants
        emit('user_left_room', {
            'session_id': session_id,
            'room_id': current_room
        }, room=current_room, include_self=False)
    
    # Join main workspace
    join_room('main')
    if 'main' not in room_participants:
        room_participants['main'] = set()
    room_participants['main'].add(request.sid)
    
    active_connections[request.sid]['current_room'] = 'main'
    
    # Update database
    workspace_session = WorkspaceSession.query.filter_by(session_id=session_id).first()
    if workspace_session:
        workspace_session.current_room = 'main'
        workspace_session.last_ping = datetime.utcnow()
        db.session.commit()

@socketio.on('screen_share_start')
def handle_screen_share_start(data):
    if request.sid not in active_connections:
        return
    
    session_id = active_connections[request.sid].get('session_id')
    current_room = active_connections[request.sid].get('current_room', 'main')
    
    emit('screen_share_started', {
        'session_id': session_id,
        'presenter_id': active_connections[request.sid].get('user_id')
    }, room=current_room, include_self=False)

@socketio.on('screen_share_stop')
def handle_screen_share_stop(data):
    if request.sid not in active_connections:
        return
    
    session_id = active_connections[request.sid].get('session_id')
    current_room = active_connections[request.sid].get('current_room', 'main')
    
    emit('screen_share_stopped', {
        'session_id': session_id,
        'presenter_id': active_connections[request.sid].get('user_id')
    }, room=current_room, include_self=False)

@socketio.on('code_collaboration_start')
def handle_code_collaboration_start(data):
    if request.sid not in active_connections:
        return
    
    session_id = active_connections[request.sid].get('session_id')
    repository_url = data.get('repository_url')
    branch = data.get('branch', 'main')
    
    emit('code_collaboration_started', {
        'session_id': session_id,
        'repository_url': repository_url,
        'branch': branch,
        'host_id': active_connections[request.sid].get('user_id')
    }, broadcast=True, include_self=False)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
