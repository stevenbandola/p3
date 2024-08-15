import { Html } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'

import { Suspense, useEffect, useRef, useState } from 'react'
import { BackSide, Color, Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader } from 'three'

export const SkySphere = () => {
  const InvertSphere = () => {
    const [image] = useState<string>('/img/time2.jpeg')

    const meshRef = useRef<Mesh>(null)
    const materialRef = useRef<MeshBasicMaterial>(null)
    const texture = useLoader(TextureLoader, image)

    const menuSphereGeometry = new SphereGeometry(99, 99, 99)
    const menuSphereMaterial = new MeshBasicMaterial({
      color: new Color('black'),
      transparent: true,
      opacity: 0.5,
      side: BackSide,
    })
    const menuSphereMesh = new Mesh(menuSphereGeometry, menuSphereMaterial)
    const atmosphereMeshRef = useRef<Mesh>(menuSphereMesh)

    const { camera } = useThree()

    useEffect(() => {
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
    }, [])

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
    </Suspense>
  )
}
