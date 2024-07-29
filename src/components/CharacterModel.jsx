import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Html, Preload, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import { Quaternion, Vector3 } from 'three'
import { myPlayer, usePlayerState } from 'playroomkit'
import soundIcon from '../assets/soundIcon.svg'
import { useXR } from '@react-three/xr'

export default function CharacterModel({ characterUrl = '', sharePos = false, player, initialPos }) {
  // useGLTF.preload('https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb')
  const [modelReady, setModelReady] = useState(false)
  const { player: xrPlayer } = useXR()
  const { camera } = useThree()

  // -- For custom models --
  // const customModel = useGLTF(characterUrl)
  // const customClone = useMemo(() => {
  //   if (customModel.scene.traverse) return SkeletonUtils.clone(customModel.scene)
  //   return undefined
  // }, [customModel.scene])

  // -- For default model --
  const defaultModel = useGLTF('https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb')
  const defaultClone = useMemo(() => SkeletonUtils.clone(defaultModel.scene).rotateY(3), [defaultModel.scene])

  const group = useRef()
  const worldPos = new Vector3()
  const worldQua = new Quaternion()

  // helpers
  let newPos
  let newRot
  useFrame(() => {
    // local characgter saves pos and rot in player's state
    if (sharePos) {
      group.current.getWorldPosition(worldPos)
      player.setState('position', [xrPlayer.position.x, xrPlayer.position.y, xrPlayer.position.z])
      group.current.getWorldQuaternion(worldQua)
      player.setState('rotation', [camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w])
    } else {
      // other characters read pos and rot from network
      newPos = player.getState('position')
      newPos && group.current.position.set(...newPos)
      newRot = player.getState('rotation')
      newRot && group.current.quaternion.set(...newRot)
    }
  })
  useEffect(() => {
    defaultClone.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
      player.id === myPlayer().id && setModelReady(true)
    })
  }, [defaultClone.scene])

  const [isInAvatarMode] = usePlayerState(myPlayer(), 'avatarMode')
  const [thisModelInAvatarMode] = usePlayerState(player, 'avatarMode')

  useEffect(() => {
    if (thisModelInAvatarMode) {
      setModelReady(false)
    }
  }, [thisModelInAvatarMode])

  return (
    <group position={initialPos} ref={group} name={`character-${player.id}`} dispose={null}>
      {!sharePos && <PlayerName name={player.state.player_name} player={player} />}
      {!sharePos && <primitive object={defaultClone} />}
    </group>
  )
}

const PlayerName = ({ name, player }) => {
  const [occluded, setOccluded] = useState(false)
  const [withMic] = usePlayerState(player, 'withVoiceChat')
  return (
    <Html style={{ transform: 'translate(-50%, 0)' }} position={[0, 2.25, 0]} occlude onOcclude={setOccluded} distanceFactor={5}>
      <div
        className='select-none text-center flex justify-center'
        style={{
          fontFamily: "''",
          opacity: occluded ? 0 : 1,
          WebkitTextStroke: '0.01rem #fff',
        }}
      >
        {name} <img src={soundIcon} className={`talking-icon ml-2 w-6 ${!withMic && 'hidden'}`} />
      </div>
    </Html>
  )
}
