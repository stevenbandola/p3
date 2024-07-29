import { RigidBody } from '@react-three/rapier'

import React, { useMemo } from 'react'
import { CanvasTexture } from 'three'

// Function to generate a texture
const generateTexture = () => {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  // Draw something on the canvas
  context.fillStyle = '#8B4513' // Brown color
  context.fillRect(0, 0, size, size)

  context.fillStyle = '#A0522D' // Sienna color
  for (let i = 0; i < 2000; i++) {
    context.fillRect(Math.random() * size, Math.random() * size, 2, 2)
  }

  return new CanvasTexture(canvas)
}

const TerrainGeneration = () => {
  const tiles = []
  const tileSize = 10
  const tileCount = 10
  const tileHeight = 0.1
  const tileWidth = 10
  const tileDepth = 10
  const positionOffset = 45

  // Generate the texture
  const texture = useMemo(() => generateTexture(), [])

  for (let i = 0; i < tileCount; i++) {
    for (let j = 0; j < tileCount; j++) {
      // Generate a random height offset
      const heightOffset = Math.random() * 2 - 1 // Random value between -1 and 1

      tiles.push(
        <mesh key={`tile-${i}-${j}`} position={[i * tileSize - positionOffset, heightOffset, j * tileSize - positionOffset]}>
          <boxGeometry args={[tileWidth, tileHeight, tileDepth]} />
          <meshStandardMaterial color='green' map={texture} />
        </mesh>
      )
    }
  }
  return <RigidBody>{tiles}</RigidBody>
}

export default TerrainGeneration
