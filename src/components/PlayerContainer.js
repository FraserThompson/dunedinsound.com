import React, { useState, useContext } from 'react'
import Player from './Player'
import { MdKeyboardArrowUp } from 'react-icons/md'
import styled from '@emotion/styled'
import { lighten } from 'polished'
import GigContext from '../templates/GigContext'
import { rhythm } from '../utils/typography'

export default () => {
  const context = useContext(GigContext)
  const [open, setOpen] = useState(false)

  return (
    <PlayerWrapper show={open}>
      {context.artistAudio.length > 0 && (
        <>
          <div className="handle">
            <button title="Audio Player" onClick={() => setOpen(!open)}>
              <small>AUDIO</small> <MdKeyboardArrowUp />
            </button>
          </div>
          <Player {...context} />
        </>
      )}
    </PlayerWrapper>
  )
}

const PlayerWrapper = styled.div`
  position: fixed;
  bottom: ${props => (props.show ? props.theme.headerHeightMobile : rhythm(-0.5))};
  z-index: 11;
  overflow: visible;
  height: ${props => props.theme.headerHeight};
  margin-top: ${props => props.theme.headerHeightNeg};
  opacity: 1;
  background-color: ${props => props.theme.primaryColor};
  width: 100%;
  transition: bottom 150ms ease-in-out;
  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    bottom: ${props => (props.show ? '0px' : props.theme.headerHeightNeg)};
  }
  .handle {
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: ${props => props.theme.headerHeight};
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
`
