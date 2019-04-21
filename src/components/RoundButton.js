// RoundButton.js
// Like a regular button except round
// Props
//  - size: width and height


import styled from 'styled-components'
import { lighten } from 'polished';

const RoundButton = styled.button`
  z-index: 11;
  color: ${props => props.theme.highlightColor2};
  border-color: ${props => props.theme.highlightColor2};
  border-radius: 50%;
  background-color: transparent;
  height: ${props => props.size};
  width: ${props => props.size};
  padding: 0;
  outline: 0;

  &:hover:not(.active) {
    color: ${props => lighten(0.2, props.theme.highlightColor2)};
    border-color: ${props => lighten(0.2, props.theme.highlightColor2)};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

export default RoundButton
