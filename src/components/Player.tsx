// import Ecctrl from 'ecctrl'
import CharacterModel from './CharacterModel'
import { myPlayer } from 'playroomkit'
import { useState } from 'react'
import { getRandomPos } from '../utils/helpers'
// import { AnimationLocalPlayer } from './AnimationLocalPlayer'
// import { animationSet } from '../hooks/useRPMAnimations'

export const Player = () => {
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
    <CharacterModel sharePos player={player} initialPos={getRandomPos()} />
    // </AnimationLocalPlayer>

    // </Ecctrl>
  )
}
