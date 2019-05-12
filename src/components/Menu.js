// Menu.js
// Parameters:
//  - horizontal (optional): Defines whether it should be displayed as a horizontal list or vertical list. Collapses at 992px by default.
//  - backgroundColor
//  - height
//  - width

import styled from '@emotion/styled'
import { rhythm, scale } from '../utils/typography';
import { lighten } from 'polished';

const Menu = styled.div`
  width: ${props => props.width};
  text-align: left;
  background-color: ${props => props.backgroundColor || props.theme.primaryColor};
  background-clip: padding-box;
  border: none;
  border-radius: 0;
  margin: 0;
  overflow-y: hidden;
  scroll-behavior: smooth;

  #vaultSessionsHeaderLink {
    font-size: 0.5em;
    max-width: 60px;
    line-height: 1;
    height: 100%;
    text-align: center;
    padding-top: 0px;
    @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
      padding-top: 18px;
    }
  }

  a, span {
    padding-left: ${rhythm(0.5)};
    padding-right: ${rhythm(0.5)};
  }

  a {
    color: ${props => props.theme.textColor};

    &:hover, &:focus {
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }

    &:active {
      background-color: ${props => props.theme.foregroundColor} !important;
    }

  }

  li {
    padding: 0;

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
    cursor: pointer;
    position: relative;
    text-decoration: none;
    white-space: nowrap;
    color: ${props => props.theme.textColor};
    line-height: ${props => props.height || props.theme.headerHeight};
    margin: 0px;
    display: ${props => props.horizontal ? "inline-block" : "block"};
    border-bottom: ${props => props.horizontal && "none"};
    border-top: ${props => props.horizontal && "none"};

    &:hover{
      color: white;
    }

    &.active, &:active {
      background-color: ${props => props.theme.secondaryColor};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }

    .title {
      ${scale(0.5)};
    }

    .listButton {
      float: right;
      a:hover {
        text-decoration: none;
        cursor: pointer;
        color: ${props => lighten(0.1, props.theme.foregroundColor)};
      }
    }

  }
`

export default Menu;
