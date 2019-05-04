import styled from '@emotion/styled'
import { scale, rhythm } from "../utils/typography";

const ZoopUpWrapper = styled.a`
  ${scale(4)};
  color: ${props => props.theme.textColor};
  position: absolute;
  text-align: center;
  top: -${rhythm(1)};
  transition: all 300ms ease-in-out;
  opacity: 0.5;

  p {
    ${scale(0.5)};
    margin-bottom: -${rhythm(1)};
    text-transform: uppercase;
  }
  &:hover {
    top: 0px;
    opacity: 1;
  }
`
export default ZoopUpWrapper
