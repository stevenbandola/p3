import { VIDEO_PLAYLIST } from '../../utils/helpers'
import { Html, PointerLockControls, PointerLockControlsProps, useAspect } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, useEffect, useState } from 'react'
import { DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three'
import { useMultiplayerState, isHost, RPC, usePlayerState, myPlayer } from 'playroomkit'
import { Button, Drawer, Flex, MantineProvider, Slider } from '@mantine/core'
import { theme } from '../../lib/mantine/theme'
import { useMenuContext } from '../../lib/context/MenuContext'
import { useXR } from '@react-three/xr'
import { IStreamableVideo } from './types'

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
  const size = useAspect(128, 72, 1)

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [listenersRegistered, setListenersRegistered] = useState(false)
  const [sources, setSources] = useState(VIDEO_PLAYLIST)
  const [showControls, setShowControls] = useState(false)

  const [videoState, setVideoState] = useMultiplayerState('videoState', { status: 'playing', currentTime: 0, currentSongIndex: 0 })
  const { camera } = useThree()
  // const [playerState, setPlayerState] = usePlayerState(player, 'menu', { opened: false })
  const { open: openMenu, close: closeMenu, setMenuContent } = useMenuContext()
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
  if (!listenersRegistered) {
    RPC.register('getCurrentTime', () => {
      setVideoState({ ...videoState, currentTime: video.currentTime })
      return new Promise(() => video.currentTime)
    })
    setListenersRegistered(true)
  }
  const fetchVideo = async (shortcode: string) => {
    const response = await fetch(`https://api.streamable.com/videos/${shortcode}`)
    const data: IStreamableVideo = await response.json()
    console.log(data)
    // setSources(data)
  }
  useEffect(() => {
    // video.src = sources[currentSongIndex].videoUrl
    video.src = sources[currentSongIndex].videoUrl
    video.src = String(localStorage.getItem('src')) || sources[currentSongIndex].videoUrl
    // console.log(localStorage.getItem('muted'))
    video.muted = localStorage.getItem('muted') === 'true'
    if (isHostPlayer) {
      const currentTimeStorage = localStorage.getItem('currentTime')
      video.currentTime = currentTimeStorage ? parseFloat(currentTimeStorage) : 0
      // setVideoState({ status: 'paused', currentTime: currentTimeStorage ?? 0, currentSongIndex: currentSongIndex ?? 0 })
    }

    // console.log('updating video state', videoState)
    video.currentTime = videoState.currentTime

    syncTimeWithHost()
    // if (videoState.status === 'playing') {
    //   video.play()
    // } else {
    //   video.pause()
    // }
    // const handleResize = () => {
    //   camera.updateProjectionMatrix()
    // }

    // window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    // return () => {}

    return () => {
      video.play()
      localStorage.setItem('muted', video.muted.toString())

      if (isHostPlayer) {
        setVideoState({ ...videoState, status: 'playing', currentTime: video.currentTime })
        // window.removeEventListener('resize', handleResize)
        // set the video state in local storage
        localStorage.setItem('currentTime', video.currentTime.toString())
        localStorage.setItem('src', video.src)
      }
    }
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
    console.log('syncing time with host')
    // console.log('newTime', await RPC.call('getCurrentTime', {}, RPC.Mode.HOST))
    await RPC.call('getCurrentTime', {}, RPC.Mode.HOST).then(newTime => {
      console.log('newTime', newTime)
      video.currentTime = newTime
      setVideoState({ ...videoState, currentTime: video.currentTime })
    })
  }

  useEffect(() => {
    console.log('updating video state', videoState)
    if (sources[videoState.currentSongIndex] && sources[videoState.currentSongIndex].videoUrl !== video.src) {
      video.src = sources[videoState.currentSongIndex].videoUrl
    }
    video.currentTime = videoState.currentTime

    if (videoState.status === 'playing') {
      video.play()
    } else {
      video.pause()
    }
  }, [videoState])

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
        setMenuContent(
          <Flex gap={5} direction={'column'}>
            {isHostPlayer && (
              <Button
                size={'md'}
                onClick={() => {
                  video.paused ? video.play() : video.pause()
                  // isHostPlayer
                  setVideoState({ ...videoState, currentTime: video.currentTime, status: video.paused ? 'paused' : 'playing' })
                  closeMenu()
                }}
              >
                Play/Pause
              </Button>
            )}

            {isHostPlayer && (
              <Slider
                size={40}
                min={0}
                max={video.seekable.length > 0 ? video.seekable.end(0) : 100}
                w={'100%'}
                defaultValue={video.currentTime}
                onChange={newValue => {
                  video.currentTime = Number(newValue)
                  setVideoState({ ...videoState, currentTime: Number(newValue) })
                  localStorage.setItem('currentTime', video.currentTime.toString())
                  closeMenu()
                }}
              />
            )}
            <Button
              size='md'
              onClick={() => {
                video.muted = !video.muted
                localStorage.setItem('muted', video.muted.toString())
                closeMenu()
              }}
            >
              {video.muted ? 'Unmute' : 'Mute'}
            </Button>
            {isHostPlayer && (
              <Button
                size='md'
                onClick={() => {
                  nextSong()
                  closeMenu()
                }}
              >
                Next
              </Button>
            )}
          </Flex>
        )
        openMenu()
        break
    }
  }

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

  useFrame(({ gl, scene }) => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // console.log(size)
      videoImageContext.drawImage(video, 0, 0)
      if (videoTexture) videoTexture.needsUpdate = true
    }

    gl.render(scene, camera)
  }, 1)

  return (
    <>
      <Suspense fallback={<></>}>
        <mesh position={[15, 8, 0]} onClick={onClick}>
          <primitive object={movieScreen} scale={[1.4766977716204095, 0.8306424965364804, 1]}></primitive>
        </mesh>
      </Suspense>
    </>
  )
}
