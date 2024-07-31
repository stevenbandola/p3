import { VIDEO_PLAYLIST } from '../utils/helpers'
import { Html, PointerLockControls, PointerLockControlsProps, useAspect } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, useEffect, useState } from 'react'
import { DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three'
import { useMultiplayerState, isHost, RPC, usePlayerState, myPlayer } from 'playroomkit'
import { Button, Drawer, Flex, MantineProvider, Slider } from '@mantine/core'
import { theme } from '../lib/mantine/theme'
import { useMenuContext } from '../MenuProvider'

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
export const VideoPlayer = (pointLockControlsRef: MutableRefObject<PointerLockControlsProps | null>) => {
  const size = useAspect(128, 72)

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [sources, setSources] = useState(VIDEO_PLAYLIST)
  const [showControls, setShowControls] = useState(false)
  const [videoState, setVideoState] = useMultiplayerState('videoState', { status: 'paused', currentTime: 0, currentSongIndex: 0 })
  // const [player] = useState(myPlayer())
  // const [playerState, setPlayerState] = usePlayerState(player, 'menu', { opened: false })
  const { open, close, setMenuContent } = useMenuContext()
  const onLoadedData = () => {
    setIsVideoLoaded(true)
  }
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

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

  useEffect(() => {
    video.src = sources[currentSongIndex].videoUrl

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

  const nextSong = () => {
    setIsVideoLoaded(false)
    console.log('next song')
    const newIndex = currentSongIndex + 1 >= sources.length ? 0 : currentSongIndex + 1
    setCurrentSongIndex(newIndex)
    video.currentTime = 0
    console.log('current song index', currentSongIndex)
    console.log('video src', sources[newIndex].videoUrl)
    video.src = sources[newIndex].videoUrl
    video.height = sources[newIndex].resolution.height
    video.width = sources[newIndex].resolution.width
    setVideoState({ status: 'playing', currentTime: 0, currentSongIndex: newIndex })
    setIsVideoLoaded(true)
    video.play()
  }

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

  useEffect(() => {
    console.log('updating video state', videoState)
    video.currentTime = videoState.currentTime

    video.src = sources[videoState.currentSongIndex] ? sources[videoState.currentSongIndex].videoUrl : video.src
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

  const onClick = (e: { button: any }) => {
    switch (e.button) {
      case 0:
        console.log('left click')

        break
      case 1:
        console.log('wheel click')

        break
      case 2:
        // console.log('right click')
        // console.log('before', pointLockControlsRef)
        if (pointLockControlsRef) {
          // console.log('unlocking', document)
          // pointLockControlsRef.current.
        }
        setMenuContent(
          <Flex gap={5} direction={'column'}>
            <Button
              size={'md'}
              onClick={() => {
                video.paused ? video.play() : video.pause()
                close()
              }}
            >
              Play/Pause
            </Button>
            <Slider
              size={40}
              min={0}
              max={video.seekable.length > 0 ? video.seekable.end(0) : 100}
              w={'100%'}
              defaultValue={video.currentTime}
              onChange={newValue => {
                video.currentTime = Number(newValue)
                close()
              }}
            />
            <Button
              size='md'
              onClick={() => {
                video.muted = !video.muted
                close()
              }}
            >
              {video.muted ? 'Unmute' : 'Mute'}
            </Button>

            <Button
              size='md'
              onClick={() => {
                nextSong()
                close()
              }}
            >
              Next
            </Button>
          </Flex>
        )
        open()
        // myPlayer().setState('menu', { opened: true }, true)
        // showControls ? setShowControls(false) : setShowControls(true)

        break
    }
  }
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
        <mesh position={[15, 8, 0]} onClick={onClick}>
          <primitive object={movieScreen} scale={size}></primitive>
        </mesh>
      </Suspense>
    </>
  )
}

const VideoPlayerControls = ({
  video,
  max,
  closeMenu,
  nextSong,
}: {
  video: HTMLVideoElement
  max: number
  closeMenu: () => void
  nextSong: () => void
}) => {
  return (
    <Html position={[15, 3, 0]} scale={4} occlude distanceFactor={5}>
      <MantineProvider theme={theme}></MantineProvider>
    </Html>
  )
}
