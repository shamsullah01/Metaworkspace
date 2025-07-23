import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const skinTones = [
  '#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', 
  '#8D5524', '#6B4423', '#4A2C2A', '#2D1B1B'
]

const hairStyles = [
  { name: 'Short', preview: '👨‍💼' },
  { name: 'Medium', preview: '👩‍💼' },
  { name: 'Long', preview: '👩‍🦰' },
  { name: 'Curly', preview: '👨‍🦱' },
  { name: 'Bald', preview: '👨‍🦲' }
]

const clothingOptions = [
  { name: 'Business Suit', color: '#1F2937', preview: '👔' },
  { name: 'Casual Shirt', color: '#3B82F6', preview: '👕' },
  { name: 'Sweater', color: '#059669', preview: '🧥' },
  { name: 'Blazer', color: '#7C3AED', preview: '🧥' }
]

const accessories = [
  { name: 'Glasses', preview: '👓' },
  { name: 'Tie', preview: '👔' },
  { name: 'Watch', preview: '⌚' },
  { name: 'Badge', preview: '🏷️' }
]

export default function AvatarCustomizer({ isOpen, onClose, onSave }) {
  const [avatarConfig, setAvatarConfig] = useState({
    skinTone: skinTones[2],
    hairStyle: hairStyles[0],
    clothing: clothingOptions[0],
    accessories: [],
    facialFeatures: {
      eyeSize: [50],
      noseSize: [50],
      mouthSize: [50],
      eyebrowThickness: [50]
    }
  })

  const handleFeatureChange = (feature, value) => {
    setAvatarConfig(prev => ({
      ...prev,
      facialFeatures: {
        ...prev.facialFeatures,
        [feature]: value
      }
    }))
  }

  const toggleAccessory = (accessory) => {
    setAvatarConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessory)
        ? prev.accessories.filter(a => a !== accessory)
        : [...prev.accessories, accessory]
    }))
  }

  const handleSave = () => {
    onSave(avatarConfig)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Customize Your Avatar</CardTitle>
            <Button variant="ghost" onClick={onClose} className="text-white">
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 h-full overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Avatar Preview */}
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-48 h-48 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl"
                  style={{ backgroundColor: avatarConfig.skinTone }}
                >
                  {avatarConfig.hairStyle.preview}
                </div>
                <div className="text-white text-lg font-semibold mb-2">Preview</div>
                <div className="flex justify-center gap-2 mb-4">
                  <Badge variant="secondary">{avatarConfig.hairStyle.name}</Badge>
                  <Badge variant="secondary">{avatarConfig.clothing.name}</Badge>
                </div>
                <div className="flex justify-center gap-1">
                  {avatarConfig.accessories.map(acc => (
                    <span key={acc.name} className="text-2xl">{acc.preview}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="space-y-6">
              <Tabs defaultValue="facial" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="facial" className="text-white">Facial</TabsTrigger>
                  <TabsTrigger value="body" className="text-white">Body</TabsTrigger>
                  <TabsTrigger value="clothing" className="text-white">Clothing</TabsTrigger>
                  <TabsTrigger value="accessories" className="text-white">Accessories</TabsTrigger>
                </TabsList>

                <TabsContent value="facial" className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Skin Tone</label>
                    <div className="grid grid-cols-8 gap-2">
                      {skinTones.map(tone => (
                        <button
                          key={tone}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatarConfig.skinTone === tone ? 'border-blue-500' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: tone }}
                          onClick={() => setAvatarConfig(prev => ({ ...prev, skinTone: tone }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Eye Size: {avatarConfig.facialFeatures.eyeSize[0]}%
                    </label>
                    <Slider
                      value={avatarConfig.facialFeatures.eyeSize}
                      onValueChange={(value) => handleFeatureChange('eyeSize', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Nose Size: {avatarConfig.facialFeatures.noseSize[0]}%
                    </label>
                    <Slider
                      value={avatarConfig.facialFeatures.noseSize}
                      onValueChange={(value) => handleFeatureChange('noseSize', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Mouth Size: {avatarConfig.facialFeatures.mouthSize[0]}%
                    </label>
                    <Slider
                      value={avatarConfig.facialFeatures.mouthSize}
                      onValueChange={(value) => handleFeatureChange('mouthSize', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Eyebrow Thickness: {avatarConfig.facialFeatures.eyebrowThickness[0]}%
                    </label>
                    <Slider
                      value={avatarConfig.facialFeatures.eyebrowThickness}
                      onValueChange={(value) => handleFeatureChange('eyebrowThickness', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="body" className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Hair Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {hairStyles.map(style => (
                        <button
                          key={style.name}
                          className={`p-3 rounded-lg border text-center ${
                            avatarConfig.hairStyle.name === style.name
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-gray-600 bg-gray-800'
                          }`}
                          onClick={() => setAvatarConfig(prev => ({ ...prev, hairStyle: style }))}
                        >
                          <div className="text-2xl mb-1">{style.preview}</div>
                          <div className="text-white text-xs">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="clothing" className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Professional Attire</label>
                    <div className="grid grid-cols-2 gap-2">
                      {clothingOptions.map(clothing => (
                        <button
                          key={clothing.name}
                          className={`p-3 rounded-lg border text-center ${
                            avatarConfig.clothing.name === clothing.name
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-gray-600 bg-gray-800'
                          }`}
                          onClick={() => setAvatarConfig(prev => ({ ...prev, clothing }))}
                        >
                          <div className="text-2xl mb-1">{clothing.preview}</div>
                          <div className="text-white text-xs">{clothing.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="accessories" className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Professional Accessories</label>
                    <div className="grid grid-cols-2 gap-2">
                      {accessories.map(accessory => (
                        <button
                          key={accessory.name}
                          className={`p-3 rounded-lg border text-center ${
                            avatarConfig.accessories.includes(accessory)
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-gray-600 bg-gray-800'
                          }`}
                          onClick={() => toggleAccessory(accessory)}
                        >
                          <div className="text-2xl mb-1">{accessory.preview}</div>
                          <div className="text-white text-xs">{accessory.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Save Avatar
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-white">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

