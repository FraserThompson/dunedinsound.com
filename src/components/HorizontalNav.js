import styled from '@emotion/styled'
import { theme } from '../utils/theme'
import { rhythm } from '../utils/typography'

export default styled.ul`
  background-color: transparent;
  width: auto;
  overflow-y: auto;
  margin-bottom: 0px;
  padding: 0px;
  margin-left: 0px;

  li {
    display: block;
    line-height: ${(props) => props.lineHeight || '40px'};
    margin: 0;
    padding-right: ${rhythm(0.5)};

    button,
    .button {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    @media screen and (min-width: ${theme.default.breakpoints.xs}) {
      display: inline-block;
    }
  }
`
