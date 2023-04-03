import React, { useCallback, useEffect, useState } from 'react'
import Player from './Player'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import styled from '@emotion/styled'
import { lighten } from 'polished'
import { calculateScrollHeaderOffset } from '../utils/helper'

export default ({ artistAudio, minimizedAlways }) => {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(minimizedAlways || false)

  const onScroll = useCallback(() => {
    if (minimizedAlways) return

    const bannerHeight = calculateScrollHeaderOffset(window)

    if (window.pageYOffset >= bannerHeight) {
      setMinimized(true)
    } else {
      setMinimized(false)
    }
  }, [])

  useEffect(() => {
    // To prompt wavesurfer to redraw the waveform we'll just trick it
    window.dispatchEvent(new Event('resize'))
  }, [minimized])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {artistAudio.length > 0 && (
        <PlayerWrapper open={open} minimized={minimized}>
          <OpenButton>
            <button title="Audio Player" onClick={() => setOpen(!open)}>
              <span>AUDIO</span> {!open ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </OpenButton>
          <Player artistAudio={artistAudio} />
        </PlayerWrapper>
      )}
    </>
  )
}

const OpenButton = styled.div`
  text-align: center;
  width: 100%;
  bottom: calc(${(props) => props.theme.headerHeightMobile} + 100px);
  left: 0px;
  font-family: monospace;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    bottom: 100px;
  }

  svg {
    font-size: 2em;
    width: 20px;
    position: relative;
  }

  span {
    position: relative;
    bottom: 10px;
  }

  button {
    pointer-events: auto;
    box-shadow: -2px -1px 3px rgb(0 0 0 / 32%), 3px 1px 3px rgb(0 0 0 / 42%);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    border: none;
    padding-right: 13px;
    height: 30px;
    color: black;
    background-color: #bfced9;
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;

    &:hover {
      color: black;
      background-color: ${(props) => lighten(0.2, props.theme.foregroundColor)};
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }
  }
`

const PlayerWrapper = styled.div`
  position: ${(props) => (props.minimized ? 'fixed' : 'static')};
  bottom: 0px;
  left: 0px;
  z-index: 11;
  overflow: visible;
  margin-top: ${(props) => (props.minimized ? props.theme.headerHeightNeg : 'auto')};
  width: 100%;

  pointer-events: ${(props) => (!props.minimized || props.open ? 'auto' : 'none')};
  transform: ${(props) => props.minimized && (!props.open ? `translateY(100px)` : `translateY(-${props.theme.headerHeightMobile})`)};
  transition: transform 150ms ease-in-out;

  ${OpenButton} {
    display: ${(props) => (!props.minimized ? 'none' : 'inline-block')};
    position: ${(props) => (!props.open ? 'absolute' : 'static')};
  }

  .player {
    filter: drop-shadow(2px 2px 10px black);
    pointer-events: ${(props) => (!props.minimized || props.open ? 'auto' : 'none')};
    visibility: ${(props) => (!props.minimized || props.open ? '1' : '0')};
    opacity: ${(props) => (!props.minimized || props.open ? '1' : '0')};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    transform: ${(props) => props.minimized && (props.open ? `translateY(0)` : `translateY(100px)`)};
  }
`
