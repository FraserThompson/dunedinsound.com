import React, { useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import styled from '@emotion/styled'

export default React.memo(({ perspective, lights = 'off', animated, backContent, topContent, bottomContent, rightContent, leftContent, children }) => {
  const callbackRef = useRef()
  const frameRef = useRef()

  const backRef = useRef()
  const topRef = useRef()
  const leftRef = useRef()
  const rightRef = useRef()
  const bottomRef = useRef()

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

  // not very reacty but w/e
  let tiltX = 0
  let tiltY = 0
  let initialBeta = false
  let initialGamma = false

  // Update position on all faces in a non-react way because it performs better
  const updatePosition = useCallback(({ gamma, beta }) => {
    if (!initialBeta) initialBeta = beta
    if (!initialGamma) initialGamma = gamma

    const portrait = window.innerHeight > window.innerWidth

    tiltX = lerp(tiltX, portrait ? gamma * 4 : beta * 4, 0.1)
    tiltY = lerp(tiltY, portrait ? (beta - initialBeta) * 4 : (gamma - initialGamma) * 4, 0.1)

    const tiltXDeg = tiltX / 10.5
    const tiltYDeg = tiltY / 10.5

    backRef.current.style.transform = `translate3d(${tiltX}px, ${tiltY}px, -600px)`
    topRef.current.style.transform = `translateZ(0) rotate3d(1, 0, 0, ${-90 + tiltYDeg}deg) skew(${tiltXDeg}deg)`
    bottomRef.current.style.transform = `translateZ(0) rotate3d(1, 0, 0, ${90 + tiltYDeg}deg) skew(${-tiltXDeg}deg)`
    leftRef.current.style.transform = `translateZ(0) rotate3d(0, 1, 0, ${90 - tiltXDeg}deg) skew(0, ${tiltYDeg}deg)`
    rightRef.current.style.transform = `translateZ(0) rotate3d(0, 1, 0, ${-90 - tiltXDeg}deg) skew(0, ${-tiltYDeg}deg)`

    if (tiltX < 0) {
      leftRef.current.style.boxShadow = `inset 10px 10px 120px 35px rgba(${-tiltX},0,${-tiltX},0.75)`
    } else {
      rightRef.current.style.boxShadow = `inset 10px 10px 120px 35px rgba(${tiltX},0,${tiltX},0.75)`
    }
  }, [])

  return (
    <WorldWrapper perspective={perspective}>
      <Back ref={backRef} className={`${lights}`}>
        {backContent}
      </Back>
      <Top ref={topRef} className={`${lights}`}>
        {topContent}
      </Top>
      <Left ref={leftRef} className={`${lights}`}>
        {leftContent}
      </Left>
      <Right ref={rightRef} className={`${lights}`}>
        {rightContent}
      </Right>
      <Bottom ref={bottomRef} className={`${lights}`}>
        {bottomContent}
      </Bottom>
      <Children>{children}</Children>
    </WorldWrapper>
  )
})

const Surface = styled.div`
  position: absolute;
  box-shadow: inset 10px 10px 120px 35px rgba(0, 0, 0, 0.75);
  background-position: 0 0, 50px 0, 50px -50px, 0px 50px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform box-shadow;
  &.off {
    background: radial-gradient(#191919 15%, transparent 15%) 0 0, radial-gradient(#292929 15%, transparent 15%) 16px 16px,
      radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 95%, transparent 20%) 16px 17px;
    background-size: 32px 32px;
  }
  &.on {
    background: radial-gradient(purple 15%, transparent 15%) 0 0, radial-gradient(yellow 15%, transparent 15%) 16px 16px,
      radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 16px 17px;
    background-size: 32px 32px;
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
  height: calc(100vh - ${props => props.theme.headerHeightMobile});
  position: relative;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: ${props => typeof InstallTrigger === 'undefined' && 'camFocus 2s'};

  h2 {
    margin: 0;
    color: cyan;
    letter-spacing: -5px;
    height: auto;
    text-align: center;
    font-size: 8vh;
    font-family: monospace;
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

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    height: calc(100vh - ${props => props.theme.headerHeight});
  }
`
const Children = styled.div`
  height: 100%;
`
