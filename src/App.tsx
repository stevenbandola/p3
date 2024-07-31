import { Canvas } from '@react-three/fiber'
import Lobby from './Lobby'
// import { AvatarCreator } from '@readyplayerme/react-avatar-creator'
import { useEffect, useState } from 'react'
import { insertCoin, myPlayer } from 'playroomkit'
import { generateRandomHexColor, getStoreValue } from './utils/helpers'
import OpenMapExperience from './components/OpenMapExperience'
import { UI } from './components/UI/UI'
import { Loading } from './components/UI/Loading'
import { XR } from '@react-three/xr'
import { MantineProvider } from '@mantine/core'
import { theme } from './lib/mantine/theme'
import { MenuProvider } from './MenuProvider'

export default function App() {
  const [avatarMode, setAvatarMode] = useState(false)
  const [gameLaunched, setGameLaunched] = useState(false)
  const [experienceReady, setExperienceReady] = useState(false)

  useEffect(() => {
    console.log('avatarMode', avatarMode)
    console.log('gameLaunched', gameLaunched)
  }, [avatarMode, gameLaunched])

  // useEffect(() => {

  if (!gameLaunched) {
    // home page

    return (
      <MantineProvider theme={theme}>
        <Lobby
          onJoinOrCreateRoom={() => {
            // setRoomCode(roomCode)
            setAvatarMode(true)
            insertCoin({
              // skipLobby: true, // skip the lobby UI and join/create the room directly
              gameId: 'QHPmW6KQm1Q1sSv9mdS5',
              roomCode: getStoreValue('room_code') ?? undefined,
            }).then(() => {
              console.log('insertCoin done')
              myPlayer().setState('character', {
                id: myPlayer().id,
                hairColor: generateRandomHexColor(),
                topColor: generateRandomHexColor(),
                bottomColor: generateRandomHexColor(),
                // set the avatar url and add a timestamp to it to avoid caching
                // avatarUrl: avatarUrl.split('?')[0] + '?' + new Date().getTime() + '&meshLod=2',
                // avatarImg: avatarImage,
              })
              console.log('player', myPlayer().getState('character'))

              myPlayer().setState('player_name', getStoreValue('player_name'))
              setAvatarMode(false)
              setGameLaunched(true)
            })
          }}
        />
      </MantineProvider>
    )
  } else {
    // show the game
    return (
      <MantineProvider theme={theme}>
        <MenuProvider>
          <Loading show={!experienceReady} />
          <Canvas shadows camera={{ position: [0, 1.55, 0], fov: 30, rotation: [0, 180, 0] }}>
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
