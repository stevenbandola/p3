// import Ecctrl from 'ecctrl'
import CharacterModel from './CharacterModel'
import { myPlayer } from 'playroomkit'
import { useState } from 'react'
// import { AnimationLocalPlayer } from './AnimationLocalPlayer'
// import { animationSet } from '../hooks/useRPMAnimations'
import { randomRange } from '../utils/helpers'
// import { PointerLockControls } from '@react-three/drei'

const getRandomPos = () => {
  const min = -20
  const max = 20
  const x = randomRange(min, max)
  const z = randomRange(min, max)
  const y = randomRange(2, 4)
  return [-50 + x, 2 + y, z]
}
// 0
// :
// -68.73304556073916
// 1
// :
// 2.854079304612015
// 2
// :
// 0.4976995442631551
export const Player = () => {
  const [initialPos] = useState(getRandomPos())
  const [player] = useState(myPlayer())
  // const characterUrl = player.state.character.avatarUrl
  // useEffect(() => {
  //   console.log('characterUrl', characterUrl)
  // }, [player])
  return (
    // This needs to be replaced with my fly controller
    // <Ecctrl
    //   debug={false}
    //   animated
    //   followLight
    //   position={initialPos}
    //   camInitDis={-0.01} // camera intial position
    //   camMinDis={-0.01} // camera zoom in closest position
    //   camFollowMult={100} // give any big number here, so the camera follows the character instantly
    //   turnVelMultiplier={1} // Turning speed same as moving speed
    //   turnSpeed={100}
    //   mode='CameraBasedMovement'
    // >

    // <AnimationLocalPlayer animationSet={animationSet} player={player} key={player.id}>
    <CharacterModel sharePos player={player} initialPos={initialPos} />
    // </AnimationLocalPlayer>

    // </Ecctrl>
  )
}
