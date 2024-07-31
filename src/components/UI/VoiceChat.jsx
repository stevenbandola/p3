import { useEffect, useRef, useState } from 'react'
import AgoraManager from '../../utils/agora_manager'
import micIconOn from '../../assets/micIconOn.svg'
import micIconOff from '../../assets/micIconOff.svg'
import speakerIconOn from '../../assets/speakerIconOn.svg'
import speakerIconOff from '../../assets/speakerIconOff.svg'
import { getRoomCode, myPlayer, useMultiplayerState, isHost } from 'playroomkit'
import { useControls } from 'leva'
import { Checkbox } from '@mantine/core'

export const VoiceChat = ({ uid }) => {
  const channelParameters = useRef({}).current
  const [remoteTrack, setRemoteTrack] = useState()
  const agoraClient = useRef()
  const [micAllowed, setMicAllowed] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [spkOn, setSpkOn] = useState(false)
  // const { isVoiceChatEnabled } = useControls({ isVoiceChatEnabled: false })
  const [player] = useState(myPlayer())
  const handleVSDKEvents = (eventName, ...args) => {
    switch (eventName) {
      case 'user-published':
        // Subscribe the remote audio track If the remote user publishes the audio track only.
        if (args[1] == 'audio') {
          // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
          setRemoteTrack(args[0].audioTrack)
        }
    }
  }
  const isHostPlayer = isHost()
  useEffect(() => {
    channelParameters.localAudioTrack && channelParameters.localAudioTrack.setEnabled(micOn)
    player.setState('withVoiceChat', micOn)

    if (spkOn) {
      remoteTrack && remoteTrack.play()
    } else {
      remoteTrack && remoteTrack.stop()
    }
  }, [micOn, spkOn, remoteTrack])
  const [voiceChatState, setVoiceChatState] = useMultiplayerState('voiceChat', { enabled: false })
  const startVoiceChat = async (enabled = false) => {
    agoraClient.current = agoraClient.current ?? (await AgoraManager(handleVSDKEvents))
    if (!agoraClient.current.config.enabled && !enabled) {
      agoraClient.current && agoraClient.current.leave(channelParameters)
    }
    const result = await agoraClient.current.join(uid, `playroom-rpm-${getRoomCode()}`, channelParameters)

    // muted by default
    channelParameters.localAudioTrack.setEnabled(false)

    // mic state based on result
    setMicAllowed(result === true)
  }

  useEffect(() => {
    // joins the channel at mount
    voiceChatState.enabled && startVoiceChat(true)

    return () => {
      agoraClient.current && agoraClient.current.leave(channelParameters)
    }
  }, [voiceChatState.enabled])

  const toggleMic = async () => {
    if (!micAllowed) return
    setMicOn(v => !v)
  }

  const toggleSpk = async () => {
    setSpkOn(v => !v)
  }
  const toggleVoiceChatEnabled = async () => {
    setVoiceChatState({ enabled: !voiceChatState.enabled })
  }

  return (
    <>
      <a
        className={`select-none rounded-full h-10 w-10 mr-3 flex justify-center cursor-pointer`}
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={toggleSpk}
      >
        <img src={spkOn ? speakerIconOn : speakerIconOff} className={`w-10 ${spkOn ? 'opacity-100' : 'opacity-50'}	`} />
      </a>
      <a
        className='select-none rounded-full h-10 w-10 mr-10 flex justify-center cursor-pointer'
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={toggleMic}
      >
        <img src={micOn ? micIconOn : micIconOff} className={`w-10 ${micOn ? 'opacity-100' : 'opacity-50'}	`} />
      </a>
      {isHostPlayer && (
        <a
          className='select-none rounded-full h-10 w-10 mr-3 flex justify-center cursor-pointer'
          onContextMenu={e => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onClick={toggleVoiceChatEnabled}
        >
          <Checkbox label='Master' checked={voiceChatState.enabled} onChange={toggleVoiceChatEnabled} />
          {/* {voiceChatState.enabled ? 'Enabled' : 'Disabled'} */}
          {/* <img src={micOn ? micIconOn : micIconOff} className={`w-10 ${micOn ? 'opacity-100' : 'opacity-50'}	`} /> */}
        </a>
      )}
    </>
  )
}
