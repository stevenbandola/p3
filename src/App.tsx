import { Canvas } from '@react-three/fiber'
import Lobby from './Lobby'
// import { AvatarCreator } from '@readyplayerme/react-avatar-creator'
import { useEffect, useRef, useState } from 'react'
import { insertCoin, myPlayer } from 'playroomkit'
import { generateRandomHexColor, getStoreValue } from './utils/helpers'
import OpenMapExperience from './components/OpenMapExperience'
import { UI } from './components/UI/UI'
import { Loading } from './components/UI/Loading'
import { XR } from '@react-three/xr'
import { MantineProvider } from '@mantine/core'
import { theme } from './lib/mantine/theme'
import { MenuProvider } from './lib/context/MenuContext'

export default function App() {
  const [avatarMode, setAvatarMode] = useState(false)
  const [gameLaunched, setGameLaunched] = useState(false)
  const [experienceReady, setExperienceReady] = useState(false)
  const [coinInserted, setCoinInserted] = useState(false)
  // const
  useEffect(() => {
    // console.log('avatarMode', avatarMode)
    // console.log('gameLaunched', gameLaunched)
  }, [avatarMode, gameLaunched])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      setExperienceReady(true)
      setGameLaunched(true)
      setAvatarMode(false)
      // document.removeEventListener('mousemove', event => get_xy(event))
    }
  }, [])

  const onJoinRoom = () => {
    // setRoomCode(roomCode)
    setAvatarMode(true)
    insertCoin({
      skipLobby: true, // skip the lobby UI and join/create the room directly
      gameId: 'QHPmW6KQm1Q1sSv9mdS5',
      roomCode: 'POD1',
    }).then(() => {
      // console.log('insertCoin done')
      myPlayer().setState('character', {
        id: myPlayer().id,
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
        // set the avatar url and add a timestamp to it to avoid caching
        // avatarUrl: avatarUrl.split('?')[0] + '?' + new Date().getTime() + '&meshLod=2',
        // avatarImg: avatarImage,
      })
      // console.log('player', myPlayer().getState('character'))

      myPlayer().setState('player_name', getStoreValue('player_name'))
      setAvatarMode(false)
      setGameLaunched(true)
      setCoinInserted(true)
    })
  }

  if (!gameLaunched) {
    // home page

    return (
      <MantineProvider theme={theme}>
        <Lobby onJoinOrCreateRoom={onJoinRoom} />
      </MantineProvider>
    )
  } else {
    // show the game
    return (
      <MantineProvider theme={theme}>
        <MenuProvider>
          <Loading show={!experienceReady} />
          <Canvas shadows camera={{ position: [0, 1.55, 0], fov: 30, rotation: [0, 180, 0] }} ref={canvasRef}>
            <XR>
              <color attach='background' args={['#fff']} />
              <OpenMapExperience onReady={setExperienceReady} />
            </XR>
          </Canvas>
          {experienceReady && <UI />}
        </MenuProvider>
      </MantineProvider>
    )
  }
}
