import { useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { myPlayer } from 'playroomkit'
import { useState } from 'react'
import { Vector3 } from 'three'

export const DesktopFlyController = () => {
  const { isPresenting, player } = useXR()
  const { camera } = useThree()
  const keyPressed: { [key: string]: any } = {}
  // const [playerState] = useState(myPlayer())
  const force = 0.5
  const drag: number = 0.97

  const [newPosition] = useState(() => new Vector3())
  const [playerVelocity] = useState(() => new Vector3())

  const direction: { [key: string]: Vector3 } = {}
  direction['w'] = new Vector3(0, 0, -1)
  direction['d'] = new Vector3(1, 0, 0)
  direction['s'] = new Vector3(0, 0, 1)
  direction['a'] = new Vector3(-1, 0, 0)
  direction[' '] = new Vector3(0, 1, 0)
  direction['Shift'] = new Vector3(0, -1, 0)
  direction['x'] = new Vector3(0, -1, 0)
  direction['e'] = new Vector3(0, -1, 0)
  direction['q'] = new Vector3(0, 1, 0)

  const handleKeyDown = (e: { key: string }) => {
    const keyList = ['w', 'd', 's', 'a', ' ', 'Shift', 'x', 'e', 'q']

    if (keyList.includes(e.key)) {
      if (!keyPressed[e.key]) {
        keyPressed[e.key] = new Date().getTime()
      }

      if (e.key === 'w' && keyPressed['s']) delete keyPressed['s']
      if (e.key === 's' && keyPressed['w']) delete keyPressed['w']
      if (e.key === 'a' && keyPressed['d']) delete keyPressed['d']
      if (e.key === 'd' && keyPressed['a']) delete keyPressed['a']
      if (e.key === ' ' && keyPressed['Shift']) delete keyPressed['Shift']
      if (e.key === 'Shift' && keyPressed[' ']) delete keyPressed[' ']
    }
  }

  const handleKeyUp = (e: { key: string | number }) => {
    delete keyPressed[e.key]
  }
  window.addEventListener('keydown', handleKeyDown, { capture: true })
  window.addEventListener('keyup', handleKeyUp)

  useFrame((renderer, delta) => {
    if (isPresenting) return

    applyAcceleration()
    movePlayer(delta)
  })

  const movePlayer = (delta: number) => {
    //calculate new position

    newPosition.set(
      player.position.x + playerVelocity.x * force * delta,
      player.position.y + playerVelocity.y * force * delta,
      player.position.z + playerVelocity.z * force * delta
    )

    const positionDelta =
      Math.abs(player.position.x - newPosition.x) +
      Math.abs(player.position.y - newPosition.y) +
      Math.abs(player.position.y - newPosition.y)

    if (positionDelta > 0) {
      player.position.x = newPosition.x
      player.position.y = newPosition.y
      player.position.z = newPosition.z
    }
  }

  const applyAcceleration = () => {
    const keys = Object.keys(keyPressed)
    if (Object.keys(keyPressed).length > 0) {
      const forceDirection = new Vector3()
      if (Object.keys(keyPressed).length > 1) {
        forceDirection.addVectors(direction[keys[0]], direction[keys[1]])
      } else {
        const singleDirection = direction[keys[0]] ? direction[keys[0]] : new Vector3()
        forceDirection.set(singleDirection.x, singleDirection.y, singleDirection.z)
      }
      playerVelocity.addVectors(forceDirection.applyQuaternion(camera.quaternion), playerVelocity)
    }

    //apply minimum brake
    const velocitySum = Math.abs(playerVelocity.x) + Math.abs(playerVelocity.y) + Math.abs(playerVelocity.z)
    if (velocitySum < 1) {
      // setIsMoving(false)
      playerVelocity.set(0, 0, 0)
    }

    playerVelocity.multiplyScalar(drag)
  }
  return <></>
}
