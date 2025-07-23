import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  FileCode, 
  Folder, 
  Play,
  Terminal,
  Settings
} from 'lucide-react'

const mockRepositories = [
  { name: 'metaworkspace-frontend', branch: 'main', status: 'active', language: 'JavaScript' },
  { name: 'api-gateway', branch: 'feature/auth', status: 'modified', language: 'Node.js' },
  { name: 'user-service', branch: 'main', status: 'clean', language: 'Python' },
  { name: 'avatar-service', branch: 'develop', status: 'modified', language: 'TypeScript' }
]

const mockFiles = [
  { name: 'App.jsx', type: 'file', modified: true },
  { name: 'components/', type: 'folder', children: [
    { name: 'Scene3D.jsx', type: 'file', modified: false },
    { name: 'AvatarCustomizer.jsx', type: 'file', modified: true },
    { name: 'VSCodePanel.jsx', type: 'file', modified: false }
  ]},
  { name: 'hooks/', type: 'folder', children: [
    { name: 'useWebRTC.js', type: 'file', modified: false },
    { name: 'useAvatar.js', type: 'file', modified: true }
  ]},
  { name: 'package.json', type: 'file', modified: false }
]

const mockCommits = [
  { hash: 'a1b2c3d', message: 'Add avatar customization interface', author: 'Alice', time: '2 hours ago' },
  { hash: 'e4f5g6h', message: 'Implement 3D workspace layout', author: 'Bob', time: '4 hours ago' },
  { hash: 'i7j8k9l', message: 'Setup Three.js integration', author: 'Charlie', time: '1 day ago' }
]

function FileTree({ files, level = 0 }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['components/', 'hooks/']))

  const toggleFolder = (folderName) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName)
    } else {
      newExpanded.add(folderName)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <div className="space-y-1">
      {files.map((file, index) => (
        <div key={index} style={{ marginLeft: `${level * 16}px` }}>
          <div 
            className={`flex items-center gap-2 p-1 rounded hover:bg-gray-700 cursor-pointer ${
              file.modified ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => file.type === 'folder' && toggleFolder(file.name)}
          >
            {file.type === 'folder' ? (
              <>
                <Folder size={16} />
                <span className="text-sm">{file.name}</span>
                {file.modified && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}
              </>
            ) : (
              <>
                <FileCode size={16} />
                <span className="text-sm">{file.name}</span>
                {file.modified && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}
              </>
            )}
          </div>
          {file.type === 'folder' && expandedFolders.has(file.name) && file.children && (
            <FileTree files={file.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function VSCodePanel({ isOpen, onClose }) {
  const [activeRepo, setActiveRepo] = useState(mockRepositories[0])
  const [activeTab, setActiveTab] = useState('files')

  if (!isOpen) return null

  return (
    <div className="fixed right-4 top-4 bottom-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-40">
      <Card className="h-full bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700 pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <FileCode size={20} />
              VS Code Integration
            </CardTitle>
            <Button variant="ghost" onClick={onClose} className="text-white p-1">
              ✕
            </Button>
          </div>
          
          {/* Repository Selector */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Active Repository</label>
            <select 
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              value={activeRepo.name}
              onChange={(e) => setActiveRepo(mockRepositories.find(r => r.name === e.target.value))}
            >
              {mockRepositories.map(repo => (
                <option key={repo.name} value={repo.name}>{repo.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <GitBranch size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">{activeRepo.branch}</span>
              <Badge 
                variant={activeRepo.status === 'modified' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {activeRepo.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 rounded-none">
              <TabsTrigger value="files" className="text-white text-xs">Files</TabsTrigger>
              <TabsTrigger value="git" className="text-white text-xs">Git</TabsTrigger>
              <TabsTrigger value="terminal" className="text-white text-xs">Terminal</TabsTrigger>
              <TabsTrigger value="run" className="text-white text-xs">Run</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="files" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Explorer</h4>
                      <Button variant="ghost" size="sm" className="text-gray-400 p-1">
                        <Settings size={14} />
                      </Button>
                    </div>
                    <FileTree files={mockFiles} />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="git" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Source Control</h4>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-400 p-1">
                          <GitCommit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 p-1">
                          <GitPullRequest size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-400 uppercase">Recent Commits</h5>
                      {mockCommits.map(commit => (
                        <div key={commit.hash} className="bg-gray-800 rounded p-3 space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-700 px-2 py-1 rounded text-blue-400">
                              {commit.hash}
                            </code>
                            <span className="text-xs text-gray-400">{commit.time}</span>
                          </div>
                          <p className="text-sm text-white">{commit.message}</p>
                          <p className="text-xs text-gray-400">by {commit.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="terminal" className="h-full m-0">
                <div className="h-full bg-black p-4 font-mono text-sm">
                  <div className="text-green-400 mb-2">
                    <Terminal size={16} className="inline mr-2" />
                    Terminal
                  </div>
                  <div className="text-gray-300 space-y-1">
                    <div>$ npm run dev</div>
                    <div className="text-blue-400">Local: http://localhost:5173/</div>
                    <div className="text-blue-400">Network: http://192.168.1.100:5173/</div>
                    <div className="text-green-400">✓ ready in 1.2s</div>
                    <div className="text-gray-500">
                      <span className="text-green-400">$</span> <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="run" className="h-full m-0">
                <div className="h-full p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Run & Debug</h4>
                      <Button variant="ghost" size="sm" className="text-gray-400 p-1">
                        <Play size={14} />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Play size={16} className="mr-2" />
                        Start Development Server
                      </Button>
                      <Button variant="outline" className="w-full border-gray-600 text-white">
                        <Terminal size={16} className="mr-2" />
                        Run Tests
                      </Button>
                      <Button variant="outline" className="w-full border-gray-600 text-white">
                        <GitCommit size={16} className="mr-2" />
                        Build Production
                      </Button>
                    </div>

                    <div className="bg-gray-800 rounded p-3">
                      <h5 className="text-sm font-medium text-white mb-2">Quick Actions</h5>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-300">• Open in GitHub Codespaces</div>
                        <div className="text-gray-300">• Share workspace with team</div>
                        <div className="text-gray-300">• Create pull request</div>
                        <div className="text-gray-300">• Deploy to staging</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

