// Tabs.js
// A divider which you can put buttons in to make tabs.
// Inherits all settings from Divider

import { invert } from 'polished'
import { rhythm } from '../utils/typography'
import styled from '@emotion/styled'
import DividerWrapper from './Divider'

export default styled(DividerWrapper)`
  height: ${props => props.theme.headerHeightMobile};
  padding: 0;
  z-index: 7;

  button:first-of-type {
    border-left: 0;
  }

  button {
    padding: 0;
    border-radius: 4px 4px 0 0;
    color: ${props => invert(props.theme.textColor)};
    border-left: 1px solid ${props => props.theme.contrastColor};
    border-right: 1px solid ${props => props.theme.contrastColor};
    border-bottom: 1px solid ${props => props.theme.contrastColor};
    border-bottom-color: transparent;
    border-top: none;
    height: 100%;
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
    text-overflow: clip;
    overflow: hidden;
    &:active,
    &.active {
      color: white;
      background-color: black;
      outline: 0;
    }
    &:hover:not(.active) {
      color: black;
    }
  }
`
