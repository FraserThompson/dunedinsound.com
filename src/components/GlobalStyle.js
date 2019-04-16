import { createGlobalStyle } from "styled-components"
import { rhythm, scale } from '../utils/typography';
import TransitionStyles from './TransitionStyles';
import { lighten, darken } from "polished";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    max-width: 100vw;
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .showMobile {
    display: initial;
  }

  .hideMobile {
    display: none;
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    .showMobile {
      display: none;
    }
    .hideMobile {
      display: initial;
    }
  }

  p {
    small {
      color: ${props => darken(0.1, props.theme.textColor)};
    }
  }

  h1.big {
    ${scale(1)};
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    text-transform: uppercase;
    margin-bottom: 0;
    text-shadow: -1px -1px 0 rgba(0,0,0,.3);

    @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
      ${scale(2)}
    }

  }

  h1.semi-big {
    ${scale(1)};
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    text-transform: uppercase;
    margin-bottom: 0;
    margin-left: ${rhythm(0.5)};
    @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
      ${scale(2)};
    }
  }

  h4 {
    transition: color 0.3s ease-in-out;
  }

  a .backgroundImage{
    transition: transform 0.3s ease-in-out;
    transform: scale(1,1);
  }

  a:hover {
    .backgroundImage {
      transform: scale(1.02,1.02);
    }
  }

  a {
    transition: color 0.1s ease-in-out;
    color: ${props => props.theme.textColor};
    text-decoration: none;
    overflow:hidden;
    background-color: transparent;

    &:active, &:hover {
      outline: 0;
    }

    &:hover, &:focus {
      h4 {
        color: ${props => lighten(0.5, props.theme.textColor)};
      }
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }

    &.active {
      background-color: ${props => props.theme.highlightColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }

  }
  li.active {
    a {
      color: white;
    }
  }

  progress {
    -webkit-appearance: none;
    appearance: none;
  }

  button, .button {
    display: inline-block;
    margin-bottom: 0;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    white-space: nowrap;

    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: ${rhythm(0.5)};
    padding-left: ${rhythm(0.5)};
    color: ${props => props.theme.textColor};
    background-color: transparent;
    border-radius: 5px;
    border: 2px solid ${props => props.theme.highlightColor2};

    &.active, &:active {
      background-color: ${props => props.theme.highlightColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }

    &:hover:not(.active) {
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }
  }

  ${TransitionStyles}

`
export default GlobalStyle;
