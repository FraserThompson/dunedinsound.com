import styled from '@emotion/styled'
import { scale, rhythm } from '../utils/typography'
import { theme } from '../utils/theme'

export default styled.a`
  ${scale(4)};
  color: ${props => props.theme.textColor};
  position: absolute;
  text-align: center;
  top: -${rhythm(1)};
  transition: all 300ms ease-in-out;
  opacity: 0.5;
  display: none !important;

  p {
    ${scale(0.5)};
    margin-bottom: -${rhythm(1)};
    text-transform: uppercase;
  }
  &:hover {
    top: 0px;
    opacity: 1;
  }

  @media screen and (min-width: ${theme.default.breakpoints.xs}) {
    display: inline-block !important;
  }
`
