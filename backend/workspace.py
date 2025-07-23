from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    github_id = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    avatar_config = db.Column(db.Text, nullable=True)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'github_id': self.github_id,
            'username': self.username,
            'email': self.email,
            'avatar_config': json.loads(self.avatar_config) if self.avatar_config else None,
            'created_at': self.created_at.isoformat(),
            'last_active': self.last_active.isoformat()
        }

class WorkspaceSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    position_x = db.Column(db.Float, default=0.0)
    position_y = db.Column(db.Float, default=0.0)
    position_z = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='available')  # available, coding, meeting, away
    current_room = db.Column(db.String(50), default='main')  # main, meeting_room_1, etc.
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_ping = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('sessions', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'position': {
                'x': self.position_x,
                'y': self.position_y,
                'z': self.position_z
            },
            'status': self.status,
            'current_room': self.current_room,
            'joined_at': self.joined_at.isoformat(),
            'last_ping': self.last_ping.isoformat(),
            'user': self.user.to_dict() if self.user else None
        }

class MeetingRoom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    max_participants = db.Column(db.Integer, default=25)
    is_active = db.Column(db.Boolean, default=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    creator = db.relationship('User', backref=db.backref('created_rooms', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'name': self.name,
            'description': self.description,
            'max_participants': self.max_participants,
            'is_active': self.is_active,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'creator': self.creator.to_dict() if self.creator else None
        }

class MeetingParticipant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(50), db.ForeignKey('meeting_room.room_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_presenter = db.Column(db.Boolean, default=False)
    is_muted = db.Column(db.Boolean, default=False)
    video_enabled = db.Column(db.Boolean, default=True)
    
    room = db.relationship('MeetingRoom', backref=db.backref('participants', lazy=True))
    user = db.relationship('User', backref=db.backref('meeting_participations', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'user_id': self.user_id,
            'joined_at': self.joined_at.isoformat(),
            'is_presenter': self.is_presenter,
            'is_muted': self.is_muted,
            'video_enabled': self.video_enabled,
            'user': self.user.to_dict() if self.user else None
        }

class CodeSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    repository_url = db.Column(db.String(200), nullable=False)
    branch = db.Column(db.String(100), default='main')
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    owner = db.relationship('User', backref=db.backref('code_sessions', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'repository_url': self.repository_url,
            'branch': self.branch,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active,
            'owner': self.owner.to_dict() if self.owner else None
        }

class CodeCollaborator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), db.ForeignKey('code_session.session_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    permissions = db.Column(db.String(20), default='read')  # read, write, admin
    
    session = db.relationship('CodeSession', backref=db.backref('collaborators', lazy=True))
    user = db.relationship('User', backref=db.backref('code_collaborations', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'user_id': self.user_id,
            'joined_at': self.joined_at.isoformat(),
            'permissions': self.permissions,
            'user': self.user.to_dict() if self.user else None
        }

