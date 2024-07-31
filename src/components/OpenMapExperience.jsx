import { Physics, vec3 } from '@react-three/rapier'
import { Environment, PointerLockControls } from '@react-three/drei'
import { Fragment, Suspense, useEffect, useState } from 'react'
import Lights from './Lights'
import Map from './Map'
import CharacterModel from './CharacterModel'
import { usePlayersState } from 'playroomkit'
import { AnimationRemotePlayer } from './AnimationRemotePlayer'
import { animationSet } from '../hooks/useRPMAnimations'
import { PlayroomJoystick } from './PlayroomJoystick'
import { Player } from './Player'
import { DesktopFlyController } from './DesktopFlyController'
import { VideoPlayer } from './VideoPlayer'
import TerrainGeneration from './TerrainGeneration'
import Cliff from './Cliff'

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

export default function OpenMapExperience({ onReady }) {
  const [mapReady, setMapReady] = useState(false)
  const characters = usePlayersState('character')

  useEffect(() => {
    onReady(mapReady)
  }, [mapReady])

  return (
    <>
      <Environment background files='/AmbienceExposure4k.hdr' />

      <Lights />

      {mapReady && <VideoPlayer />}

      <Physics timeStep='vary' debug={false} gravity={vec3({ x: 0, y: mapReady ? -9.8 : 0, z: 0 })}>
        {characters
          .filter(({ state }) => state) // remove nulls
          .map(({ state, player }) => {
            return player.id === player.myId ? (
              // controlled player
              <Fragment key={`local-${state.id}`}>
                <PointerLockControls />
                <DesktopFlyController />
                <Player />
                <PlayroomJoystick player={player} />
              </Fragment>
            ) : (
              // remote player
              <Fragment key={`remote-${state.id}`}>
                <Suspense>
                  <AnimationRemotePlayer animationSet={animationSet} player={player} key={player.id}>
                    <CharacterModel player={player} />
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
