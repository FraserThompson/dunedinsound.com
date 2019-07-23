import React, { useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import styled from '@emotion/styled'

export default React.memo(({ perspective, lights = 'off', animated, backWallContent, children }) => {
  const callbackRef = useRef()
  const frameRef = useRef()

  const backRef = useRef()
  const topRef = useRef()
  const leftRef = useRef()
  const rightRef = useRef()
  const bottomRef = useRef()

  // not very reacty but w/e
  let tiltX = 0
  let tiltY = 0

  const loop = () => {
    frameRef.current = window.requestAnimationFrame(loop)
    const cb = callbackRef.current
    cb && cb()
  }

  // linear interpolation: takes the current and future point and averages it to smooth the animation
  const lerp = useCallback((start, end, amt) => (1 - amt) * start + amt * end, [])

  useLayoutEffect(() => {
    frameRef.current = typeof window !== `undefined` && window.requestAnimationFrame(loop)
    return () => typeof window !== `undefined` && window.cancelAnimationFrame(frameRef.current)
  }, [])

  useEffect(() => {
    if (typeof window !== `undefined` && animated && window.DeviceMotionEvent) window.addEventListener('deviceorientation', orientationChange, false)
    return () => typeof window !== `undefined` && animated && window.removeEventListener('deviceorientation', orientationChange)
  }, [])

  // Fired whenever device orientation changes
  const orientationChange = useCallback(eventData => {
    callbackRef.current = () => updatePosition(eventData)
  }, [])

  // Update position on all faces in a non-react way because it performs better
  const updatePosition = useCallback(({ gamma, beta }) => {
    tiltX = lerp(tiltX, gamma, 0.1)
    tiltY = lerp(tiltY, beta, 0.1)

    const tiltXDeg = tiltX / 10.5
    const tiltYDeg = tiltY / 10.5

    backRef.current.style.transform = `translate3d(${tiltX}px, ${tiltY}px, -600px)`
    topRef.current.style.transform = `translateZ(0) rotate3d(1, 0, 0, ${-90 + tiltYDeg}deg) skew(${tiltXDeg}deg)`
    bottomRef.current.style.transform = `translateZ(0) rotate3d(1, 0, 0, ${90 + tiltYDeg}deg) skew(${-tiltXDeg}deg)`
    leftRef.current.style.transform = `translateZ(0) rotate3d(0, 1, 0, ${90 - tiltXDeg}deg) skew(0, ${tiltYDeg}deg)`
    rightRef.current.style.transform = `translateZ(0) rotate3d(0, 1, 0, ${-90 - tiltXDeg}deg) skew(0, ${-tiltYDeg}deg)`
  }, [])

  return (
    <WorldWrapper perspective={perspective}>
      <Back ref={backRef} className={`${lights}`}>
        {backWallContent}
      </Back>
      <Top ref={topRef} className={`${lights}`} />
      <Left ref={leftRef} className={`${lights}`} />
      <Right ref={rightRef} className={`${lights}`} />
      <Bottom ref={bottomRef} className={`${lights}`} />
      <Children>{children}</Children>
    </WorldWrapper>
  )
})

const Surface = styled.div`
  position: absolute;
  background-size: 30px 30px;
  background-position: 0 0, 50px 0, 50px -50px, 0px 50px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
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
  transform: translateZ(0) rotate3d(1, 0, 0, 90deg) skew(0deg);
  height: 600px;
  width: 100vw;
`

const Top = styled(Surface)`
  background-color: #191919;
  top: 0;
  transform-origin: center top;
  transform: translateZ(0) rotate3d(1, 0, 0, -90deg) skew(0deg);
  height: 600px;
  width: 100vw;
`

const Left = styled(Surface)`
  background-color: #191919;
  left: 0;
  transform-origin: left center;
  transform: translateZ(0) rotate3d(0, 1, 0, 90deg) skew(0, 0deg);
  height: 100vh;
  width: 600px;
`

const Right = styled(Surface)`
  background-color: #191919;
  right: 0;
  transform-origin: right center;
  transform: translateZ(0) rotate3d(0, 1, 0, -90deg) skew(0, 0deg);
  height: 100vh;
  width: 600px;
`

const Back = styled(Surface)`
  height: 100vh;
  width: 100vw;
  background-color: darkblue;
  transform: translate3d(0, 0, -600px);
  will-change: transform;
`
const WorldWrapper = styled.div`
  overflow: hidden;
  background-color: black;
  perspective: ${props => props.perspective || '300px'};
  transition: perspective 0.3s ease-in-out;
  width: 100%;
  height: calc(100vh - ${props => props.theme.headerHeight});
  position: relative;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: ${props => typeof InstallTrigger === 'undefined' && 'camFocus 2s'};

  h2 {
    margin: 0;
    color: cyan;
    letter-spacing: 2px;
    height: auto;
    text-align: center;
    text-shadow: 2px 2px 0px black, -2px -2px 0px white, 4px 4px 0px black, -4px -4px 0px white, 0 0 60px purple;
    font-size: 10vh;
    @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 12vh;
    }
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
  height: 100%;
`
