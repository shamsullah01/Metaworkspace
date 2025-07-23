import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Users,
  MessageSquare,
  Settings,
  Phone,
  PhoneOff
} from 'lucide-react'

const mockParticipants = [
  { id: 1, name: 'Alice Johnson', avatar: '👩‍💼', isMuted: false, isVideoOn: true, isPresenting: false },
  { id: 2, name: 'Bob Smith', avatar: '👨‍💼', isMuted: true, isVideoOn: true, isPresenting: true },
  { id: 3, name: 'Charlie Brown', avatar: '👨‍🦱', isMuted: false, isVideoOn: false, isPresenting: false },
  { id: 4, name: 'Diana Prince', avatar: '👩‍🦰', isMuted: false, isVideoOn: true, isPresenting: false },
  { id: 5, name: 'You', avatar: '👤', isMuted: false, isVideoOn: true, isPresenting: false }
]

export default function MeetingRoom({ isOpen, onClose }) {
  const [participants, setParticipants] = useState(mockParticipants)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [showChat, setShowChat] = useState(false)

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    // In a real implementation, this would start/stop screen sharing
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    setParticipants(prev => 
      prev.map(p => p.name === 'You' ? { ...p, isMuted: !isMuted } : p)
    )
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    setParticipants(prev => 
      prev.map(p => p.name === 'You' ? { ...p, isVideoOn: !isVideoOn } : p)
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-7xl max-h-screen bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-xl font-semibold">Team Standup Meeting</h2>
            <Badge variant="secondary" className="bg-green-600">
              <Users size={14} className="mr-1" />
              {participants.length} participants
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="text-white"
            >
              <MessageSquare size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <Settings size={16} />
            </Button>
            <Button variant="destructive" onClick={onClose}>
              <PhoneOff size={16} className="mr-2" />
              Leave
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Screen Share / Main Video Area */}
            <div className="flex-1 bg-gray-800 relative">
              {isScreenSharing || participants.some(p => p.isPresenting) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-gray-700 rounded-lg p-8 text-center">
                    <Monitor size={48} className="text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl mb-2">Screen Sharing Active</h3>
                    <p className="text-gray-400">
                      {participants.find(p => p.isPresenting)?.name || 'You'} is sharing their screen
                    </p>
                    <div className="mt-4 bg-gray-900 rounded p-4">
                      <div className="text-green-400 font-mono text-sm">
                        // VS Code - MetaWorkspace Project
                        <br />
                        function Scene3D() {'{'}
                        <br />
                        &nbsp;&nbsp;return (
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;Canvas camera={'{'}{'{'} position: [10, 8, 10] {'}'}{'}'}{'>'} 
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* 3D Workspace Content */}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/Canvas{'>'}
                        <br />
                        &nbsp;&nbsp;)
                        <br />
                        {'}'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Monitor size={48} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-white text-xl mb-2">No Screen Share Active</h3>
                    <p className="text-gray-400 mb-4">Start sharing your screen to collaborate</p>
                    <Button onClick={toggleScreenShare} className="bg-blue-600 hover:bg-blue-700">
                      <Monitor size={16} className="mr-2" />
                      Share Screen
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Participant Video Grid */}
            <div className="bg-gray-900 p-4 border-t border-gray-700">
              <div className="grid grid-cols-5 gap-4">
                {participants.map(participant => (
                  <div key={participant.id} className="relative">
                    <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                      {participant.isVideoOn ? (
                        <div className="text-4xl">{participant.avatar}</div>
                      ) : (
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                          <VideoOff size={24} className="text-gray-500" />
                        </div>
                      )}
                      
                      {/* Status indicators */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {participant.isMuted && (
                          <div className="bg-red-600 rounded-full p-1">
                            <MicOff size={12} className="text-white" />
                          </div>
                        )}
                        {participant.isPresenting && (
                          <div className="bg-blue-600 rounded-full p-1">
                            <Monitor size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Name label */}
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
                        <span className="text-white text-xs">{participant.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <div className="flex justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={toggleMute}
                  className="rounded-full w-12 h-12"
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>
                
                <Button
                  variant={!isVideoOn ? "destructive" : "secondary"}
                  onClick={toggleVideo}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </Button>
                
                <Button
                  variant={isScreenSharing ? "default" : "secondary"}
                  onClick={toggleScreenShare}
                  className="rounded-full w-12 h-12"
                >
                  {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">Meeting Chat</h3>
              </div>
              
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-blue-400 text-sm font-medium">Alice Johnson</div>
                  <div className="text-white text-sm">Let's review the 3D workspace implementation</div>
                  <div className="text-gray-400 text-xs mt-1">2 minutes ago</div>
                </div>
                
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-green-400 text-sm font-medium">Bob Smith</div>
                  <div className="text-white text-sm">The avatar customization looks great! 👍</div>
                  <div className="text-gray-400 text-xs mt-1">1 minute ago</div>
                </div>
                
                <div className="bg-blue-600 rounded p-3 ml-8">
                  <div className="text-blue-100 text-sm font-medium">You</div>
                  <div className="text-white text-sm">Thanks! Ready to demo the VS Code integration</div>
                  <div className="text-blue-200 text-xs mt-1">Just now</div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

