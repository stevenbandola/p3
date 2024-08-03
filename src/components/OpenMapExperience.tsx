import { Physics, vec3 } from '@react-three/rapier'
import { Environment } from '@react-three/drei'
import { Fragment, Suspense, useEffect, useState } from 'react'
import Lights from './Lights'
import Map from './Map'
import CharacterModel from './CharacterModel'
import { myPlayer, usePlayersState } from 'playroomkit'
import { AnimationRemotePlayer } from './AnimationRemotePlayer'
import { animationSet } from '../hooks/useRPMAnimations'
import { PlayroomJoystick } from './PlayroomJoystick'
import { Player } from './Player'
import { DesktopFlyController } from './DesktopFlyController'
import { VideoPlayer } from './VideoPlayer/VideoPlayer'
import TerrainGeneration from './TerrainGeneration'
import Cliff from './Cliff'
import { useThree } from '@react-three/fiber'
import { PointerLockControls } from '../lib/PointerLockControls/PointerLockControls'
import { getRandomPos, randomRange } from '../utils/helpers'
import { SkySphere } from './SkySphere'
/**
 * Keyboard control preset
 */
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'action1', keys: ['1'] },
  { name: 'action2', keys: ['2'] },
  { name: 'action3', keys: ['3'] },
  { name: 'action4', keys: ['KeyF'] },
]

export default function OpenMapExperience({ onReady }: { onReady: (ready: boolean) => void }) {
  const [mapReady, setMapReady] = useState(false)
  const characters = usePlayersState('character')
  const [player] = useState(myPlayer())
  useEffect(() => {
    onReady(mapReady)
  }, [mapReady])

  return (
    <>
      {/* <Environment background files='/AmbienceExposure4k.hdr' /> */}
      <SkySphere />

      <Lights />

      {mapReady && <VideoPlayer />}

      <Physics timeStep='vary' debug={false} gravity={[0, mapReady ? -9.8 : 0, 0]}>
        {characters
          .filter(({ state }) => state) // remove nulls
          .map(({ state, player: p }) => {
            return player.id === p.id ? (
              // controlled player
              <Fragment key={`local-${state.id}`}>
                <PointerLockControls />
                <DesktopFlyController />
                <Player />
                <PlayroomJoystick player={p} />
              </Fragment>
            ) : (
              // remote player
              <Fragment key={`remote-${state.id}`}>
                <Suspense>
                  <AnimationRemotePlayer animationSet={animationSet} player={p} key={p.id}>
                    <CharacterModel player={p} initialPos={getRandomPos()} />
                  </AnimationRemotePlayer>
                </Suspense>
              </Fragment>
            )
          })}
        <Map onMapReady={() => setMapReady(true)} />
        <TerrainGeneration />
        <Cliff />
        {/* <RoughPlane /> */}
      </Physics>
    </>
  )
}
