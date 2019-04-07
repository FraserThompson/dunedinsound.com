import styled from "styled-components"
import { rhythm } from '../utils/typography';

const HorizontalNav = styled.ul`
  background-color: transparent;
  width: auto;
  max-height: 40vh;
  overflow-y: auto;

  li {
    display: inline-block;
    line-height: 40px;
    padding-right: ${rhythm(0.5)};
    button {
      padding-right: ${rhythm(1)};
      padding-left: ${rhythm(1)};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
  }
}`

export default HorizontalNav
