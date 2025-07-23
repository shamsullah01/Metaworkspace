import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Scene3D from './components/Scene3D'
import AvatarCustomizer from './components/AvatarCustomizer'
import VSCodePanel from './components/VSCodePanel'
import MeetingRoom from './components/MeetingRoom'
import { 
  User, 
  Code, 
  Video, 
  Users, 
  Settings, 
  Github,
  Monitor,
  Headphones
} from 'lucide-react'
import './App.css'

function App() {
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false)
  const [showVSCodePanel, setShowVSCodePanel] = useState(false)
  const [showMeetingRoom, setShowMeetingRoom] = useState(false)
  const [userAvatar, setUserAvatar] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    // Simulate GitHub OAuth login
    setIsAuthenticated(true)
    setShowAvatarCustomizer(true)
  }

  const handleAvatarSave = (avatarConfig) => {
    setUserAvatar(avatarConfig)
    console.log('Avatar saved:', avatarConfig)
  }

  const onlineUsers = [
    { name: 'Alice', status: 'coding', avatar: '👩‍💼' },
    { name: 'Bob', status: 'meeting', avatar: '👨‍💼' },
    { name: 'Charlie', status: 'available', avatar: '👨‍🦱' },
    { name: 'Diana', status: 'away', avatar: '👩‍🦰' }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-2">MetaWorkspace</CardTitle>
            <p className="text-gray-400">Virtual Workspace for Software Engineers</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-white text-lg mb-2">Welcome to the Future of Remote Work</h3>
              <p className="text-gray-400 text-sm mb-6">
                Collaborate with your team in a 3D virtual workspace with integrated VS Code, 
                GitHub, and immersive meeting rooms.
              </p>
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-gray-900 hover:bg-black border border-gray-600"
            >
              <Github className="mr-2" size={20} />
              Sign in with GitHub
            </Button>
            
            <div className="text-center text-xs text-gray-500">
              Secure authentication via GitHub OAuth
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-bold">MetaWorkspace</h1>
            <Badge variant="secondary" className="bg-green-600">
              <Users size={14} className="mr-1" />
              {onlineUsers.length + 1} online
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVSCodePanel(!showVSCodePanel)}
              className="text-white"
            >
              <Code size={16} className="mr-2" />
              VS Code
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMeetingRoom(true)}
              className="text-white"
            >
              <Video size={16} className="mr-2" />
              Meeting
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAvatarCustomizer(true)}
              className="text-white"
            >
              <User size={16} className="mr-2" />
              Avatar
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Team Panel */}
      <div className="absolute top-20 left-4 z-30">
        <Card className="w-64 bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {onlineUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{user.name}</div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'available' ? 'bg-green-500' :
                      user.status === 'coding' ? 'bg-blue-500' :
                      user.status === 'meeting' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-xs text-gray-400 capitalize">{user.status}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Current User */}
            <div className="flex items-center gap-3 p-2 rounded bg-blue-600/20 border border-blue-600/30">
              <div className="text-2xl">
                {userAvatar ? userAvatar.hairStyle.preview : '👤'}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">You</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400">Available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <div className="absolute bottom-4 left-4 z-30">
        <Card className="w-64 bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start border-gray-600 text-white"
              onClick={() => setShowMeetingRoom(true)}
            >
              <Video size={16} className="mr-2" />
              Start Meeting
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start border-gray-600 text-white"
              onClick={() => setShowVSCodePanel(true)}
            >
              <Monitor size={16} className="mr-2" />
              Open VS Code
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start border-gray-600 text-white"
            >
              <Headphones size={16} className="mr-2" />
              Join Voice Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main 3D Scene */}
      <div className="absolute inset-0 pt-16">
        <Scene3D />
      </div>

      {/* Overlays */}
      <AvatarCustomizer
        isOpen={showAvatarCustomizer}
        onClose={() => setShowAvatarCustomizer(false)}
        onSave={handleAvatarSave}
      />
      
      <VSCodePanel
        isOpen={showVSCodePanel}
        onClose={() => setShowVSCodePanel(false)}
      />
      
      <MeetingRoom
        isOpen={showMeetingRoom}
        onClose={() => setShowMeetingRoom(false)}
      />

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-30">
        <Card className="w-80 bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-white text-sm font-medium mb-2">Navigation</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Click and drag to rotate view</div>
              <div>• Scroll to zoom in/out</div>
              <div>• Right-click and drag to pan</div>
              <div>• Use toolbar buttons to access features</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
