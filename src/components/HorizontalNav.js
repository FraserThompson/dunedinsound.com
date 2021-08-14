import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default styled.ul`
  background-color: transparent;
  width: auto;
  max-height: 40vh;
  overflow-y: auto;
  margin-bottom: 0px;
  padding: 0px;
  margin-left: 0px;

  li {
    display: inline-block;
    line-height: ${(props) => props.lineHeight || '40px'};
    margin: 0;
    padding-right: ${rhythm(0.5)};
    button,
    .button {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`
