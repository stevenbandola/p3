import { taya } from '../utils/helpers'
import { useAspect } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Suspense, useEffect, useState } from 'react'
import { DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three'
import { useMultiplayerState, isHost, RPC } from 'playroomkit'

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
  const onLoadedData = () => {
    setIsVideoLoaded(true)
  }
  const [{ isPlaying }, setIsPlaying] = useControls(() => ({
    isPlaying: false,
  }))
  const [{ isMuted }, setIsMuted] = useControls(() => ({
    isMuted: false,
  }))
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
    // store time before and after fetching and adjust based on loading time
    // then only update the playback for the user that requested it
    await RPC.call('getCurrentTime', {}, RPC.Mode.HOST)
  }
  RPC.register('getCurrentTime', () => {
    const initialTime = new Date().getTime()
    setVideoState({ status: 'playing', currentTime: video.currentTime })
    const finalTime = new Date().getTime()
    const timeDifference = finalTime - initialTime
    return new Promise(() => (video.currentTime += timeDifference)) // setVideoState({ status: 'playing', currentTime: newTime })    return
  })

  const [videoState, setVideoState] = useMultiplayerState('videoState', { status: 'paused', currentTime: 0 })

  useEffect(() => {
    if (isPlaying) {
      !isHostPlayer && syncTimeWithHost()
      video.play()
      isHostPlayer && setVideoState({ status: 'playing', currentTime: video.currentTime })
    } else {
      video.pause()
      isHostPlayer && setVideoState({ status: 'paused', currentTime: video.currentTime })
    }
  }, [isPlaying])

  useEffect(() => {
    video.muted = isMuted
  }, [isMuted])

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
    if (videoState.isPlaying) {
      setIsPlaying({ isPlaying: true })
    }
    if (videoState.isMuted) {
      setIsMuted({ isMuted: true })
    }
    // fetch video state from local storage

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
  // videoImage.width = 960
  // videoImage.height = 540
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

  // movieScreen.rotation.set(0, 0, 90)
  movieScreen.position.set(15, 8, 0)
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
        <primitive object={movieScreen} scale={size}></primitive>
      </Suspense>
    </>
  )
}
