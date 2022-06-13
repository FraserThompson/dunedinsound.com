// RoundButton.js
// Like a regular button except round
// Props
//  - size: width and height

import styled from '@emotion/styled'
import { lighten } from 'polished'

export default styled.button`
  z-index: 11;
  color: #bfced9;
  border: 2px outset #abb6c5;
  border-radius: 50%;
  background-color: transparent;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  padding: 0;
  outline: 0;

  &:hover:not(.active) {
    color: ${() => lighten(0.2, '#bfced9')};
    border-color: ${() => lighten(0.2, '#abb6c5')};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`
