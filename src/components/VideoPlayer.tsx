import { taya } from '../utils/helpers'
import { Html, useAspect } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three'
import { useMultiplayerState, isHost, RPC } from 'playroomkit'
import { Button, Flex, MantineProvider, Slider } from '@mantine/core'
import { theme } from '../lib/mantine/theme'
/**
 *
 * Maybe split up Video into VideoController and VideoPlayer
 * VideoPlayer would be an object in game
 * VideoController would keep track of each players status and currentTime and coordinate with other players
 *
 * AnimationPlayer
 * - accepts objects and scripts to program movement of those objects
 *
 * EventPlayer
 * coordinates with all controllers and players
 *
 * useEvent hook for managing all state?
 * similar to useXR
 *
 *
 */
export const VideoPlayer = () => {
  const size = useAspect(128, 72)

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [src, setSrc] = useState(taya.videoUrl)
  const [showControls, setShowControls] = useState(false)
  const onLoadedData = () => {
    setIsVideoLoaded(true)
  }

  const isHostPlayer = isHost()
  const [video] = useState(() => {
    const vid = document.createElement('video')
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.volume = 0.2
    vid.height = 1280
    vid.width = 720
    vid.preload = 'metadata'
    vid.onloadeddata = onLoadedData
    vid.setAttribute('style', `opacity: ${isVideoLoaded ? 1 : 0} `)
    vid.currentTime = 0

    return vid
  })
  const syncTimeWithHost = async () => {
    await RPC.call('getCurrentTime', {}, RPC.Mode.HOST)
  }
  RPC.register('getCurrentTime', () => {
    const initialTime = new Date().getTime()
    setVideoState({ status: 'playing', currentTime: video.currentTime })
    const finalTime = new Date().getTime()
    const timeDifference = finalTime - initialTime
    return new Promise(() => (video.currentTime += timeDifference))
  })

  const [videoState, setVideoState] = useMultiplayerState('videoState', { status: 'paused', currentTime: 0 })

  useEffect(() => {
    console.log('updating video state', videoState)
    video.currentTime = videoState.currentTime
    if (videoState.status === 'playing') {
      video.play()
    } else {
      video.pause()
    }
  }, [videoState])

  useEffect(() => {
    console.log('updating video state', videoState)
    video.currentTime = videoState.currentTime

    syncTimeWithHost()
    if (videoState.status === 'playing') {
      video.play()
    } else {
      video.pause()
    }
    return () => {
      isHostPlayer && setVideoState({ status: 'playing', currentTime: video.currentTime })
    }
  }, [])

  // const setVideoPlayback = status => {
  //   if (status.detail === 'playing') {
  //     video.play()
  //   }
  //   if (status.detail === 'paused') {
  //     video.pause()
  //   }
  // console.log(`updating ${pod.id} to ${video.currentTime}`)

  // updateMedia({ podId: pod.id, media: { status: status.detail, currentTime: video.currentTime } })

  // setIsPlaying(status.detail)
  //   return
  // }
  useEffect(() => {
    video.src = src

    if (isHostPlayer) {
      const currentTimeStorage = localStorage.getItem('currentTime')
      video.currentTime = currentTimeStorage ? parseFloat(currentTimeStorage) : 0
      setVideoState({ status: 'paused', currentTime: currentTimeStorage ?? 0 })
    }

    return () => {
      video.pause()
      // set the video state in local storage
      localStorage.setItem('currentTime', video.currentTime.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   on('setVideoPlayback', setVideoPlayback)
  //   return () => off('setVideoPlayback', setVideoPlayback)
  // }, [pod.id])

  const videoImage = document.createElement('canvas')
  videoImage.width = 1280
  videoImage.height = 720

  const videoImageContext = videoImage.getContext('2d')!
  videoImageContext.fillStyle = '#000000'
  videoImageContext?.fillRect(0, 0, videoImage.width, videoImage.height)

  const videoTexture = new Texture(videoImage)
  videoTexture.minFilter = LinearFilter
  videoTexture.magFilter = LinearFilter

  const videoMaterial = new MeshBasicMaterial({ map: videoTexture, side: DoubleSide })
  const movieGeometry = new PlaneGeometry(10, 10)
  const movieScreen = new Mesh(movieGeometry, videoMaterial)

  movieScreen.rotateY(-Math.PI / 2)

  const { camera } = useThree()

  useFrame(({ gl, scene }) => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoImageContext.drawImage(video, 0, 0)
      if (videoTexture) videoTexture.needsUpdate = true
    }

    gl.render(scene, camera)
  }, 1)

  return (
    <>
      <Suspense fallback={<></>}>
        <mesh
          position={[15, 8, 0]}
          onClick={e => {
            switch (e.button) {
              case 0:
                console.log('left click')

                break
              case 1:
                console.log('wheel click')

                break
              case 2:
                console.log('right click')
                showControls ? setShowControls(false) : setShowControls(true)

                break
            }
          }}
        >
          <primitive object={movieScreen} scale={size}></primitive>
        </mesh>
        {showControls && <VideoPlayerControls video={video} closeMenu={() => setShowControls(false)} />}
      </Suspense>
    </>
  )
}

const VideoPlayerControls = ({ video, closeMenu }: { video: HTMLVideoElement; closeMenu: () => void }) => {
  return (
    <Html position={[15, 3, 0]} scale={4} occlude distanceFactor={5}>
      <MantineProvider theme={theme}>
        <Flex gap={5} direction={'column'}>
          <Button size={'xl'} onClick={() => (video.paused ? video.play() : video.pause())}>
            Play/Pause
          </Button>
          <Slider
            size={40}
            min={0}
            max={video.seekable.end(0)}
            w={700}
            defaultValue={video.currentTime}
            onChange={newValue => (video.currentTime = Number(newValue))}
          />
          <Button size='xl' onClick={() => (video.muted = !video.muted)}>
            {video.muted ? 'Unmute' : 'Mute'}
          </Button>
          <Button size='xl' onClick={closeMenu}>
            Close
          </Button>
        </Flex>
      </MantineProvider>
    </Html>
  )
}
