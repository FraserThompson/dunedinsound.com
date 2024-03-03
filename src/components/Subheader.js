import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'

export default styled.div`
  position: fixed;
  top: ${(props) => props.theme.headerHeightMobile};
  z-index: 8;
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  display: flex;
  align-items: center;

  color: black;
  border-bottom: 1px solid black;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);

  font-size: 80%;
  width: 100%;
  min-height: ${(props) => props.theme.subheaderHeight};

  background-color: ${(props) => props.theme.contrastColor};

  > div,
  span {
    margin-right: ${rhythm(0.5)};
  }

  button,
  .button {
    border: none;
    background-color: black;
    &.active,
    &:active {
      color: black;
      background-color: ${(props) => props.theme.foregroundColor};
    }
  }
  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    position: fixed;
    top: ${(props) => props.theme.headerHeight};
  }
`
