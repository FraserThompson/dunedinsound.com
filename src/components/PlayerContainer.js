import React, { useState } from 'react'
import Player from './Player'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import styled from '@emotion/styled'
import { lighten } from 'polished'

export default ({ artistAudio, audioFeature }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {audioFeature && artistAudio.length > 0 && <Player artistAudio={artistAudio} />}
      {!audioFeature && artistAudio.length > 0 && (
        <HiddenPlayerWrapper show={open}>
          <OpenButton show={open}>
            <button title="Audio Player" onClick={() => setOpen(!open)}>
              <small>AUDIO</small> {!open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>
          </OpenButton>
          <Player artistAudio={artistAudio} />
        </HiddenPlayerWrapper>
      )}
    </>
  )
}

const HiddenPlayerWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  z-index: 11;
  overflow: visible;
  margin-top: ${(props) => props.theme.headerHeightNeg};
  width: 100%;

  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
  transform: ${(props) => (props.show ? `translateY(-${props.theme.headerHeightMobile})` : `translateY(100px)`)};
  transition: transform 150ms ease-in-out;

  .player {
    pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
    visibility: ${(props) => (props.show ? '1' : '0')};
    opacity: ${(props) => (props.show ? '1' : '0')};
    transition: all 150ms ease-in-out;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    transform: ${(props) => (props.show ? `translateY(0)` : `translateY(100px)`)};
  }
`

const OpenButton = styled.div`
  position: ${(props) => (!props.show ? 'absolute' : 'static')};
  text-align: center;
  width: 100%;
  bottom: calc(${(props) => props.theme.headerHeightMobile} + 100px);

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    bottom: 100px;
  }

  svg {
    font-size: 2em;
    position: relative;
  }

  small {
    position: relative;
    bottom: 12px;
  }

  button {
    pointer-events: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    border: none;
    padding-right: 5px;
    height: 30px;
    color: black;
    background-color: ${(props) => props.theme.foregroundColor};
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;

    &:hover {
      color: black;
      background-color: ${(props) => lighten(0.2, props.theme.foregroundColor)};
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }
  }
`
