// import { useJoystickControls } from 'ecctrl'
import { Joystick } from 'playroomkit'
import { useEffect, useRef, useState } from 'react'
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
  // const lookJoystick = useRef()
  const [isJoystickReset, setIsJoystickReset] = useState(true)
  const resetJoystick = isJoystickMoving => {
    if (!isJoystickReset && !isJoystickMoving) {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))
      setIsJoystickReset(true)
    }
  }
  useEffect(() => {
    joystick.current = new Joystick(player, {
      type: 'angular', // this is required by JoystickOptions
    })
    // lookJoystick.current = new Joystick(player, {
    //   type: 'angular', // this is required by JoystickOptions
    // })

    // append joystick & buttons div elements into #joystick element, this way
    // we can control visibility via #joystick
    const joystickContainer = window.document.querySelector('#joystick')
    joystickContainer.style.display = 'inherits'
    joystickContainer.appendChild(joystick.current.joystick.$element)

    // const lookJoystickContainer = window.document.querySelector('#lookJoystick')
    // lookJoystickContainer.style.display = 'inherits'
    // lookJoystick.current.joystick.$element.style.left = ''
    // lookJoystick.current.joystick.$element.style.right = '10px'
    // lookJoystickContainer.appendChild(lookJoystick.current.joystick.$element)

    Object.keys(joystick.current.buttons).forEach(btnKey => {
      const button = joystick.current.buttons[btnKey]
      // stops propagation to avoid camera jumping
      button.$element.addEventListener('touchmove', e => {
        e.stopPropagation()
      })
      joystickContainer.appendChild(button.$element)
    })
    // Object.keys(lookJoystick.current.buttons).forEach(btnKey => {
    //   const button = lookJoystick.current.buttons[btnKey]
    //   // stops propagation to avoid camera jumping
    //   button.$element.addEventListener('touchmove', e => {
    //     e.stopPropagation()
    //   })
    //   lookJoystickContainer.appendChild(button.$element)
    // })
  }, [player])

  useFrame(() => {
    if (!joystick.current) return

    if (joystick.current.isJoystickPressed()) {
      isJoystickReset && setIsJoystickReset(false)
      const angle = joystick.current.angle() - Math.PI / 2
      console.log(angle)

      // if angle is upwards
      if (angle > 0.3925 && angle < 2.7475) {
        console.log('upwards')
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
      } else {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))
      }
      // // if angle is downwards
      if (angle < -0.3925 && angle > -2.7475) {
        console.log('downwards')
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }))
      } else {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))
      }

      // // if angle is leftwards
      if ((angle > 1.9625 && angle <= 3.14) || (angle < -1.9625 && angle >= -3.14)) {
        console.log('leftwards')
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      } else {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
      }

      // // if angle is rightwards
      if (angle > -1.1775 && angle < 1.1775) {
        console.log('rightwards')
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }))
      } else {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))
      }
    } else {
      !isJoystickReset && resetJoystick()
    }
  })

  return <></>
}
