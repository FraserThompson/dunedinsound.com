import React, { useEffect, useState, useCallback } from 'react'
import styled from '@emotion/styled'

export default React.memo(({ perspective, lights = 'off', animated, children }) => {
  const [deviceTilt, setDeviceTilt] = useState(0)

  useEffect(() => {
    if (typeof window !== `undefined` && animated && window.DeviceMotionEvent) window.addEventListener('deviceorientation', orientationChange, false)
    return () => typeof window !== `undefined` && animated && window.removeEventListener('deviceorientation', orientationChange)
  }, [])

  const orientationChange = useCallback(eventData => setDeviceTilt(eventData.gamma || 0), [])

  return (
    <WorldWrapper perspective={perspective}>
      <Back className={`${lights}`} deviceTilt={deviceTilt} deviceTiltDeg={deviceTilt ? deviceTilt / 10.5 : 0} />
      <Top className={`${lights}`} deviceTilt={deviceTilt} deviceTiltDeg={deviceTilt ? deviceTilt / 10.5 : 0} />
      <Left className={`${lights}`} deviceTilt={deviceTilt} deviceTiltDeg={deviceTilt ? deviceTilt / 10.5 : 0} />
      <Right className={`${lights}`} deviceTilt={deviceTilt} deviceTiltDeg={deviceTilt ? deviceTilt / 10.5 : 0} />
      <Bottom className={`${lights}`} deviceTilt={deviceTilt} deviceTiltDeg={deviceTilt ? deviceTilt / 10.5 : 0} />
      <Children deviceTilt={deviceTilt}>{children}</Children>
    </WorldWrapper>
  )
})

const Surface = styled.div`
  position: absolute;
  background-size: 30px 30px;
  background-position: 0 0, 50px 0, 50px -50px, 0px 50px;
  &.off {
    background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, #000), color-stop(0.25, transparent)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, #050505), color-stop(0.25, transparent)),
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.75, transparent), color-stop(0.75, #161616)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.75, transparent), color-stop(0.75, #282828));
  }
  &.on {
    background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, white), color-stop(0.25, transparent)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, transparent), color-stop(0.25, #050505)),
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.75, #161616), color-stop(0.75, transparent)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.75, #282828), color-stop(0.75, transparent));
  }
`

const Bottom = styled(Surface)`
  background-color: black;
  bottom: 0;
  transform-origin: center bottom;
  transform: rotateX(90deg) skew(${props => -props.deviceTiltDeg}deg);
  will-change: transform;
  height: 600px;
  width: 100vw;
`

const Top = styled(Surface)`
  background-color: #191919;
  top: 0;
  transform-origin: center top;
  transform: rotateX(-90deg) skew(${props => props.deviceTiltDeg}deg);
  will-change: transform;
  height: 600px;
  width: 100vw;
`

const Left = styled(Surface)`
  background-color: #191919;
  left: 0;
  transform-origin: left center;
  transform: rotateY(${props => 90 - props.deviceTiltDeg}deg);
  will-change: transform;
  height: 100vh;
  width: 600px;
`

const Right = styled(Surface)`
  background-color: #191919;
  right: 0;
  transform-origin: right center;
  transform: rotateY(${props => -90 - props.deviceTiltDeg}deg);
  will-change: transform;
  height: 100vh;
  width: 600px;
`

const Back = styled(Surface)`
  height: 100vh;
  width: 100vw;
  background-color: darkblue;
  transform: translateZ(-600px) translateX(${props => props.deviceTilt}px);
  will-change: transform;
`
const WorldWrapper = styled.div`
  overflow: hidden;
  background-color: black;
  perspective: ${props => props.perspective || '300px'};
  transition: all 0.3s ease-in-out;
  width: 100%;
  height: calc(100vh - ${props => props.theme.headerHeight});
  position: relative;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: ${props => typeof InstallTrigger === 'undefined' && 'camFocus 2s'};

  h2 {
    margin: 0;
    color: cyan;
    letter-spacing: 2px;
    height: auto;
    text-align: center;
    text-shadow: 2px 2px 0px black, -2px -2px 0px white, 4px 4px 0px black, -4px -4px 0px white, 0 0 60px purple;
    font-size: 12vh;
  }

  @keyframes camFocus {
    0% {
      perspective: 10px;
    }
    100% {
      perspective: 300px;
    }
  }
`
const Children = styled.div`
  .posts {
    transform: translateZ(-600px) translateX(${props => props.deviceTilt}px);
    will-change: transform;
    article {
      transition: all 0.3s ease-in-out;
      background-color: rgba(0, 0, 0, 0.8);
      border: 10px dotted yellow;
      &:hover {
        filter: invert(1);
      }
    }
  }
`
