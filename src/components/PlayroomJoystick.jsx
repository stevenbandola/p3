// import { useJoystickControls } from 'ecctrl'
import { Joystick } from 'playroomkit'
import { useEffect, useRef } from 'react'
import jumpButtonImage from '../assets/chevron-double-up.svg'
import sprintButtonImage from '../assets/chevron-double-right.svg'
import { useFrame } from '@react-three/fiber'

export const PlayroomJoystick = ({ player }) => {
  // const setJoystick = useJoystickControls(state => state.setJoystick)
  // const resetJoystick = useJoystickControls(state => state.resetJoystick)
  // const pressButton1 = useJoystickControls(state => state.pressButton1)
  // const releaseAllButtons = useJoystickControls(state => state.releaseAllButtons)
  // const movementJoystick = useRef()
  const joystick = useRef()

  useEffect(() => {
    joystick.current = new Joystick(player, {
      type: 'angular', // this is required by JoystickOptions
      buttons: [
        { id: 'jump', icon: jumpButtonImage },
        { id: 'sprint', icon: sprintButtonImage },
      ],
    })
    // movementJoystick.current = new Joystick(player, {
    //   type: 'dpad',
    // })
    // append joystick & buttons div elements into #joystick element, this way
    // we can control visibility via #joystick
    const joystickContainer = window.document.querySelector('#joystick')
    joystickContainer.style.display = 'inherits'
    joystickContainer.appendChild(joystick.current.joystick.$element)
    // joystickContainer.appendChild(movementJoystick.current.joystick.$element)

    Object.keys(joystick.current.buttons).forEach(btnKey => {
      const button = joystick.current.buttons[btnKey]
      // stops propagation to avoid camera jumping
      button.$element.addEventListener('touchmove', e => {
        e.stopPropagation()
      })
      joystickContainer.appendChild(button.$element)
    })
  }, [player])

  useFrame(() => {
    if (!joystick.current) return

    // if (joystick.current.isPressed('jump')) {
    //   document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
    // } else {
    //   // releaseAllButtons()
    //   document.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))
    // }
    if (joystick.current.isJoystickPressed()) {
      // if joystick is pressed, use the angle to determine which keyboard events should be triggered
      const angle = joystick.current.angle()
      // console.log(joystick.current)
      // console.log(joystick.current.angle() - Math.PI / 2)
      // console.log(angle)
      // if angle is upwards
      if (angle > Math.PI / 2) {
        console.log('upwards')
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
      } else {
        console.log('not upwards')
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))
      }
      // // if angle is downwards
      // if (angle > (3 * Math.PI) / 4) {
      //   document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }))
      // } else {
      //   document.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))
      // }

      // // if angle is leftwards
      // if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      //   document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      // } else {
      //   document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
      // }

      // // if angle is rightwards
      // if (angle < Math.PI / 4 || angle > (7 * Math.PI) / 4) {
      //   document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }))
      // } else {
      //   document.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))
      // }

      // console.log(joystick.current.angle() - Math.PI / 2)
      // setJoystick(1, joystick.current.angle() - Math.PI / 2, joystick.current.isPressed('sprint'))
    } else {
      // resetJoystick()
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))
    }
  })

  return <></>
}
