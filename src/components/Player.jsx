import Ecctrl from 'ecctrl'
import CharacterModel from './CharacterModel'
import { myPlayer } from 'playroomkit'
import { useEffect, useState } from 'react'
import { AnimationLocalPlayer } from './AnimationLocalPlayer'
import { animationSet } from '../hooks/useRPMAnimations'
import { randomRange } from '../utils/helpers'
import { PointerLockControls } from '@react-three/drei'

const getRandomPos = () => {
  const min = 0
  const max = 10
  const x = randomRange(min, max)
  const z = randomRange(min, max)
  const y = 10
  return [x, y, z]
}
export const Player = () => {
  const [initialPos] = useState(getRandomPos())
  const [player] = useState(myPlayer())
  const characterUrl = player.state.character.avatarUrl
  useEffect(() => {
    console.log('characterUrl', characterUrl)
  }, [player])
  return (
    // This needs to be replaced with my fly controller
    <Ecctrl
      debug={false}
      animated
      followLight
      position={initialPos}
      camInitDis={-0.01} // camera intial position
      camMinDis={-0.01} // camera zoom in closest position
      camFollowMult={100} // give any big number here, so the camera follows the character instantly
      turnVelMultiplier={1} // Turning speed same as moving speed
      turnSpeed={100}
      mode='CameraBasedMovement'
    >
      <PointerLockControls />
      <AnimationLocalPlayer animationSet={animationSet} player={player} key={characterUrl}>
        {/* <CharacterModel characterUrl={characterUrl} sharePos player={player} /> */}
      </AnimationLocalPlayer>
    </Ecctrl>
  )
}
