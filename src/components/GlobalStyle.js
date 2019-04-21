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

  input[type=text] {
    background-image: none;
    padding: 8px 12px;
    line-height: ${rhythm(1)};
    border: 1px solid #000;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  }

  input[type=text]:focus {
    border: 1px solid ${props => props.theme.highlightColor2};
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    outline: 0;
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

  p, span {
    small {
      color: ${props => darken(0.1, props.theme.textColor)};
    }
    &.smaller {
      ${scale(-0.4)};
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

  li.active {
    a {
      color: white;
    }
  }

  .tile {
    a {
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

  a {
    transition: color 0.1s ease-in-out;
    color: ${props => darken(0.2, props.theme.highlightColor)};
    text-decoration: none;
    overflow:hidden;
    background-color: transparent;

    &:hover {
      color: ${props => props.theme.highlightColor2};
    }

    &:active, &:hover {
      outline: 0;
    }

  }

  ${TransitionStyles}

`
export default GlobalStyle;
