import React, { useState } from 'react'
import Player from './Player'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import styled from '@emotion/styled'
import { lighten } from 'polished'
import { rhythm } from '../utils/typography'

export default ({ artistAudio }) => {
  const [open, setOpen] = useState(false)

  return (
    <PlayerWrapper show={open}>
      {artistAudio.length > 0 && (
        <>
          <div className="handle">
            <button title="Audio Player" onClick={() => setOpen(!open)}>
              <small>AUDIO</small> {!open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>
          </div>
          <Player artistAudio={artistAudio} />
        </>
      )}
    </PlayerWrapper>
  )
}

const PlayerWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  z-index: 11;
  overflow: visible;
  margin-top: ${props => props.theme.headerHeightNeg};
  width: 100%;

  transform: ${props => (props.show ? `translateY(-${props.theme.headerHeightMobile})` : `translateY(100px)`)};
  transition: transform 150ms ease-in-out;

  .player {
    pointer-events: ${props => (props.show ? 'auto' : 'none')};
    visibility: ${props => (props.show ? '1' : '0')};
    opacity: ${props => (props.show ? '1' : '0')};
    transition: all 150ms ease-in-out;
  }

  .handle {
    position: ${props => (!props.show ? 'absolute' : 'static')};
    text-align: center;
    width: 100%;
    bottom: calc(${props => props.theme.headerHeightMobile} + 100px);

    @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
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
      box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.175);
      border: none;
      padding-right: 5px;
      height: 30px;
      background-color: ${props => props.theme.foregroundColor};
      border-top-left-radius: 60px;
      border-top-right-radius: 60px;
      &:hover {
        background-color: ${props => lighten(0.2, props.theme.foregroundColor)};
      }
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    transform: ${props => (props.show ? `translateY(0)` : `translateY(100px)`)};
  }
`
