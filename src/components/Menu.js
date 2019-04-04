import styled from "styled-components"
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';

const Menu = styled.ul`
  width: ${props => props.width};
  text-align: left;
  background-color: ${props => props.theme.headerColor};
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
  border: none;
  border-radius: 0;
  margin: 0;
  list-style: none;
  overflow-y: hidden;

  li {
    line-height: ${props => props.theme.headerHeight};
    border-bottom: ${props => !props.horizontal && "1px solid rgba(255,255,255,0.1)"};
    border-top: ${props => !props.horizontal && "1px solid rgba(0,0,0,0.2)"};
    margin: 0px;
    display: ${props => props.horizontal ? "inline-block" : "block"};
    cursor: pointer;


    &.active {
      > a{
        background-color: ${props => props.theme.highlightColor2};
        color: ${props => lighten(0.5, props.theme.textColor)};
      }
    }

    > a {
      padding-left: ${rhythm(0.5)};
      padding-right: ${rhythm(0.5)};
      border-right: ${props => props.horizontal && "1px solid rgba(0,0,0,0.2)"};
      border-left: ${props => props.horizontal && "1px solid rgba(255,255,255,0.1)"};
      text-decoration: none;
      position: relative;
      display: block;
    }

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
`

export default Menu;
