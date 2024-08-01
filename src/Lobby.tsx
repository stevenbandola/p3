import { useState } from 'react'
import { generateRandomGuestName, getHashValue, getStoreValue, setHashValue, setStoreValue } from './utils/helpers'
import { Button, Input, Flex } from '@mantine/core'

function Lobby({ onJoinOrCreateRoom }: { onJoinOrCreateRoom: () => void }) {
  // const [screen, setScreen] = useState(getHashValue('r') ? 'NAME' : 'LOBBY')
  const [playerName, setPlayerName] = useState(getStoreValue('player_name') || generateRandomGuestName()) // NEW / JOIN

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='text-black text-4xl font-bold'>Podchurch</div>
      <div className='text-black text-xl f '>Version 3.1</div>

      <div className='flex mt-20'>
        {/* <button
            className='rounded-lg px-3 py-2 m-3'
            style={{ backgroundColor: '#A2DCBB' }}
            onClick={() => {
              setHashValue('r', '')
              setScreen('NAME')
            }}
          >
            New room
          </button> */}
        <UsernameInput value={playerName} onChange={setPlayerName} onSubmit={() => onJoinOrCreateRoom()} />

        <Button
          onClick={() => {
            setStoreValue('player_name', playerName)
            onJoinOrCreateRoom()
          }}
        >
          Next
        </Button>
      </div>

      <div className='absolute bottom-5 text-xs gap-2 flex items-center'>
        <Button>Donate</Button>
      </div>
    </div>
  )
}

export default Lobby

type UsernameInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

const UsernameInput = ({ onSubmit, onChange, value }: UsernameInputProps) => (
  <>
    <Input
      maxLength={300}
      placeholder='write your name'
      // className='flex-1 min-w-0 rounded-xl bg-transparent focus:outline-none focus:border-none input-box text5 font-bold'
      type='text'
      onChange={e => {
        onChange(e.target.value)
      }}
      onKeyDown={e => {
        e.stopPropagation() // avoids moving character while typing
        e.code === 'Enter' && onSubmit()
        // e.code === 'Escape' && e.target.blur()
      }}
      value={value}
    />
  </>
)
