import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'

export default function Map({ onMapReady }) {
  const floorRef = useRef()

  return (
    <>
      <RigidBody type='fixed' ref={floorRef}>
        <mesh position={[0, -5, 0]} transparent opacity={0}>
          <cylinderGeometry args={[40, 40, 0.5, 50]} transparent opacity={0} />
          <shadowMaterial color='#333' transparent opacity={0} />
          <meshStandardMaterial color='lightblue' transparent opacity={0} />
        </mesh>
      </RigidBody>
      <GroundSensor callback={onMapReady} />
    </>
  )
}

const GroundSensor = ({ callback }) => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initialized && callback()
  }, [initialized])

  return (
    <>
      <RigidBody gravityScale={0} transparent opacity={0}>
        <CuboidCollider
          args={[5, 5, 1]}
          sensor
          onIntersectionEnter={() => {
            setInitialized(true)
          }}
        />
      </RigidBody>
    </>
  )
}
