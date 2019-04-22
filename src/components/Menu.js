// Menu.js
// Parameters:
//  - horizontal (optional): Defines whether it should be displayed as a horizontal list or vertical list. Collapses at 992px by default.
//  - backgroundColor
//  - height
//  - width

import styled from "styled-components"
import { rhythm, scale } from '../utils/typography';
import { lighten } from 'polished';

const Menu = styled.div`
  width: ${props => props.width};
  text-align: left;
  background-color: ${props => props.backgroundColor || props.theme.headerColor};
  background-clip: padding-box;
  border: none;
  border-radius: 0;
  margin: 0;
  overflow-y: hidden;
  scroll-behavior: smooth;

  a {
    color: ${props => props.theme.textColor};
    &:hover, &:focus {
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }
  }

  li {
    > a {
      display: block;
    }

    &.active {
      a {
        color: ${props => lighten(0.5, props.theme.textColor)};
      }
    }
  }

  > a, li {
    position: relative;
    color: ${props => props.theme.textColor};
    line-height: ${props => props.height || props.theme.headerHeight};
    margin: 0px;
    display: ${props => props.horizontal ? "inline-block" : "block"};
    border-bottom: ${props => props.horizontal && "none"};
    border-top: ${props => props.horizontal && "none"};

    cursor: pointer;

    &.active {
      background-color: ${props => props.theme.highlightColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }

    &.active-parent {
      border-left: 5px solid ${props => props.theme.highlightColor};
      padding-left: ${"calc(" + rhythm(0.5) + " - 5px)"};
      > a {
        color: white;
      }
    }

    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};

    text-decoration: none;

    .title {
      ${scale(0.5)};
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
