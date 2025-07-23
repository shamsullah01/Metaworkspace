import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Text, Box, Sphere } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

// Avatar component representing a user in the workspace
function Avatar({ position, color = '#4F46E5', name = 'User' }) {
  const meshRef = useRef()
  
  return (
    <group position={position}>
      {/* Simple avatar representation */}
      <Sphere ref={meshRef} args={[0.3, 16, 16]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color={color} />
      </Sphere>
      {/* Body */}
      <Box args={[0.4, 1.2, 0.2]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Name label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  )
}

// Workstation component
function Workstation({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desk */}
      <Box args={[2, 0.1, 1]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#8B5CF6" />
      </Box>
      {/* Monitor */}
      <Box args={[1.5, 0.8, 0.1]} position={[0, 1.4, -0.4]}>
        <meshStandardMaterial color="#1F2937" />
      </Box>
      {/* Monitor screen */}
      <Box args={[1.4, 0.7, 0.05]} position={[0, 1.4, -0.35]}>
        <meshStandardMaterial color="#059669" emissive="#059669" emissiveIntensity={0.2} />
      </Box>
    </group>
  )
}

// Meeting room component
function MeetingRoom({ position }) {
  return (
    <group position={position}>
      {/* Room walls */}
      <Box args={[6, 3, 0.1]} position={[0, 1.5, -3]}>
        <meshStandardMaterial color="#374151" transparent opacity={0.3} />
      </Box>
      <Box args={[0.1, 3, 6]} position={[-3, 1.5, 0]}>
        <meshStandardMaterial color="#374151" transparent opacity={0.3} />
      </Box>
      <Box args={[0.1, 3, 6]} position={[3, 1.5, 0]}>
        <meshStandardMaterial color="#374151" transparent opacity={0.3} />
      </Box>
      
      {/* Conference table */}
      <Box args={[4, 0.1, 2]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#6B7280" />
      </Box>
      
      {/* Chairs around table */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Box key={i} args={[0.4, 0.8, 0.4]} position={[x, 0.4, 1.2]}>
          <meshStandardMaterial color="#4B5563" />
        </Box>
      ))}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Box key={i + 4} args={[0.4, 0.8, 0.4]} position={[x, 0.4, -1.2]}>
          <meshStandardMaterial color="#4B5563" />
        </Box>
      ))}
      
      {/* Meeting room label */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#60A5FA"
        anchorX="center"
        anchorY="middle"
      >
        Meeting Room
      </Text>
    </group>
  )
}

// Main 3D scene component
export default function Scene3D() {
  const [avatars] = useState([
    { id: 1, position: [2, 0, 2], color: '#EF4444', name: 'Alice' },
    { id: 2, position: [-2, 0, 1], color: '#10B981', name: 'Bob' },
    { id: 3, position: [1, 0, -2], color: '#F59E0B', name: 'Charlie' },
    { id: 4, position: [-1, 0, -1], color: '#8B5CF6', name: 'Diana' },
  ])

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [10, 8, 10], fov: 60 }}
        shadows
        className="bg-gray-900"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Environment */}
          <Environment preset="night" />
          
          {/* Grid floor */}
          <Grid
            args={[20, 20]}
            position={[0, 0, 0]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#374151"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#4F46E5"
          />
          
          {/* Central collaboration hub */}
          <group>
            <Workstation position={[0, 0, 0]} />
            <Workstation position={[3, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
            <Workstation position={[0, 0, 3]} rotation={[0, Math.PI, 0]} />
            <Workstation position={[-3, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
          </group>
          
          {/* Individual workstations */}
          <Workstation position={[8, 0, 2]} />
          <Workstation position={[8, 0, -2]} />
          <Workstation position={[-8, 0, 2]} />
          <Workstation position={[-8, 0, -2]} />
          
          {/* Meeting room */}
          <MeetingRoom position={[0, 0, -10]} />
          
          {/* Avatars */}
          {avatars.map(avatar => (
            <Avatar
              key={avatar.id}
              position={avatar.position}
              color={avatar.color}
              name={avatar.name}
            />
          ))}
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

