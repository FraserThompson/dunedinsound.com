import { invert } from 'polished'
import { rhythm } from '../utils/typography'
import styled from '@emotion/styled'
import Divider from './Divider';

const Tabs = styled(Divider)`
  padding: 0;
  height: ${rhythm(1.5)};
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
    line-height: ${rhythm(1.5)};
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
    &:active, &.active {
      color: white;
      outline: 0;
    }
    &:hover:not(.active) {
      color: black;
    }
  }
`

export default Tabs
