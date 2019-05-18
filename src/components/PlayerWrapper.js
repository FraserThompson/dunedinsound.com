import styled from '@emotion/styled'
import { lighten } from 'polished'

const PlayerWrapper = styled.div`
  position: fixed;
  bottom: ${props => props.show ? "0px" : props.theme.headerHeightNeg };
  z-index: 11;
  overflow: visible;
  height: ${props => props.theme.headerHeight};
  margin-top: ${props => props.theme.headerHeightNeg};
  opacity: 1;
  background-color: ${props => props.theme.primaryColor};
  width: 100%;
  transition: bottom 150ms ease-in-out;
  .handle {
    position: absolute;
    text-align: center;
    width: 100%;
    bottom:  ${props => props.theme.headerHeight};
    svg {
      font-size: 2em;
      position: relative;
    }
    small {
      position: relative;
      bottom: 12px;
    }
    button {
      box-shadow: 0 -6px 12px rgba(0,0,0,.175);
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

export default PlayerWrapper
