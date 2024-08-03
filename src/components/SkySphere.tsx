import { Html } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'

import { Suspense, useEffect, useRef, useState } from 'react'
import {
  BackSide,
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
  SphereGeometry,
  Texture,
  TextureLoader,
} from 'three'

export const SkySphere = () => {
  const [textures, setTextures] = useState([])

  const InvertSphere = () => {
    const [image] = useState<string>('/img/time2.jpeg')

    const meshRef = useRef<Mesh>(null)
    const materialRef = useRef<MeshBasicMaterial>(null)
    const texture = useLoader(TextureLoader, image)

    // const atmosphereMeshRef = useRef<Mesh>(null)

    const menuSphereGeometry = new SphereGeometry(99, 99, 99)
    const menuSphereMaterial = new MeshBasicMaterial({
      color: new Color('black'),
      transparent: true,
      opacity: 0.5,
      side: BackSide,
    })
    const menuSphereMesh = new Mesh(menuSphereGeometry, menuSphereMaterial)
    const atmosphereMeshRef = useRef<Mesh>(menuSphereMesh)

    // const { player, isPresenting } = useXR()
    const { camera } = useThree()

    useEffect(() => {
      // player.position.set(-100, 0, 0)
      // camera.rotateY(-Math.PI / 2)
      // camera.position.set(0, 0, 0)
      camera.far = 100000
      camera.updateProjectionMatrix()
      if (materialRef.current) {
        materialRef.current.lightMapIntensity = 0.2
        materialRef.current.color = new Color('0x000000')
        atmosphereMeshRef.current.material = menuSphereMaterial
        atmosphereMeshRef.current.geometry = menuSphereGeometry
        materialRef.current.map = texture
        materialRef.current.needsUpdate = true
      }
      // materialRef.current.needsUpdate = true
    }, [])

    // console.log('🚀 ~ cleanup ~ texture:', texture)

    // useEffect(() => {
    //   // console.log('🚀 ~ //useEffect ~ texture:', texture)
    // }, [props.pod.id])

    return (
      <>
        <mesh ref={meshRef} position={[0, 40, 0]}>
          <sphereGeometry attach='geometry' args={[100, 100, 100]} />
          <meshBasicMaterial ref={materialRef} attach='material' side={BackSide} />
        </mesh>

        <mesh ref={atmosphereMeshRef} position={[0, 40, 0]}></mesh>
      </>
    )
  }

  const Fallback = () => (
    <Html>
      <p>Loading...</p>
    </Html>
  )

  return (
    <Suspense fallback={<Fallback />}>
      <InvertSphere />
      {/* <InvertSphere pod={pod} textures={textures} setTextures={setTextures} /> */}
    </Suspense>
  )
}
