import styled from "styled-components"
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';

const Menu = styled.ul`
  min-width: 200px;
  width: ${props => props.width};
  text-align: left;
  background-color: ${props => props.theme.highlightColor2};
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
  border: none;
  border-radius: 0;
  margin: 0;
  list-style: none;
  overflow-y: hidden;

  li {
    line-height: 40px;
    border-bottom: 2px solid ${props => props.theme.contrastColor};
    margin: 0px;

    &.active {
      background-color: ${props => props.theme.highlightColor};
      color: ${props => props.theme.highlightColor2};
    }

    cursor: pointer;

    &:hover:not(.active) {
      background-color: ${props => lighten(0.1, props.theme.highlightColor2)};
    }

    .inner {
      padding: 10px;
      display: block;
      text-decoration: none;

      .title {
        font-size: ${rhythm(0.5)};
      }

      .listButton {
        float: right;
        a:hover {
          text-decoration: none;
          cursor: pointer;
          color: ${props => lighten(0.1, props.theme.highlightColor)};
        }
      }
    }
  }
`

export default Menu;
