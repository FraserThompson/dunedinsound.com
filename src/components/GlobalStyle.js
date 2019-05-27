import { css } from '@emotion/core'
import { scale, rhythm } from '../utils/typography'
import TransitionStyles from './TransitionStyles'
import { lighten, darken } from "polished"
import { theme } from '../utils/theme'

// we can't call functions in emotion css so these are out here... it's ok for now
const lightText = lighten(0.5, theme.default.textColor)
const darkText = darken(0.2, theme.default.foregroundColor)
const padding = rhythm(0.5)
const scale2 = scale(2)
const scale1 = scale(1)
const scale04 = scale(-0.4)

const GlobalStyle = css`
  body {
    background-color: ${theme.default.backgroundColor};
    color: ${theme.default.textColor};
    max-width: 100vw;
    height: 100%;
    width: 100%;
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
    line-height: ${theme.default.headerHeightMobile};
    border: 1px solid #000;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }

  input[type=text]:focus {
    border: 1px solid ${theme.default.secondaryColor};
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    outline: 0;
  }

  progress {
    -webkit-appearance: none;
    appearance: none;
  }

  .showMobile {
    display: inline-block !important;
  }

  .hideMobile {
    display: none !important;
  }

  @media screen and (min-width: ${theme.default.breakpoints.xs}) {
    .showMobile {
      display: none !important;
    }
    .hideMobile {
      display: inline-block !important;
    }
  }

  figcaption {
    font-style: italic;
  }

  p, span {
    small {
      color: ${theme.default.textColor};
      font-size: 16px;
    }
    &.smaller {
      ${scale04};
    }
  }

  .rainbowBackground {
    background: linear-gradient(to right, #FF0080, #FF8C00, #40E0D0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    &:hover {
      filter: invert(1);
    }
  }

  .coolText {
    background: rgb(34,195,174);
    background: linear-gradient(0deg, rgba(34,195,174,1) 25%, rgba(255,0,190,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    &:hover {
      filter: invert(1);
    }
  }

  h1.big {
    ${scale1};
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    text-transform: uppercase;
    margin-bottom: 0;
    text-shadow: -1px -1px 0 rgba(0,0,0,.3);

    @media screen and (min-width: ${theme.default.breakpoints.md}) {
      ${scale2};
    }

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
    padding-right: ${padding};
    padding-left: ${padding};
    color: ${theme.default.textColor};
    background-color: transparent;
    border-radius: 5px;
    border: 2px solid ${theme.default.secondaryColor};

    &.active, &:active {
      background-color: ${theme.default.secondaryColor};
      color: ${lightText};
      outline: 0;
    }

    &:focus {
      outline: 0;
    }

    &:hover:not(.active) {
      color: ${lightText};
      text-decoration: none;
    }
  }

  a {
    color: ${darkText};
    transition: color 0.1s ease-in-out;
    text-decoration: none;
    overflow:hidden;
    background-color: transparent;

    .backgroundImage{
      transition: transform 0.3s ease-in-out;
      transform: scale(1,1);
    }

    &:hover, &:active {
      color: ${theme.default.secondaryColor};
      outline: 0;
      .backgroundImage {
        transform: scale(1.02,1.02);
      }
    }

    &.trippy {
      z-index: 1000;
      display: inline-block;
      color: white;
      transition: all 0.2s ease-in-out;
      transform: skew(-30deg) scale(1, 2);
      background: linear-gradient(to right, #FF0080, #FF8C00, #40E0D0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &.trippy:hover {
      color: limegreen;
      text-decoration: none;
      transform: scaleY(10) scaleX(5) rotateX(360deg) translateX(20px) translateY(-5px);
    }

    &.trippy2 {
      display: inline-block;
      z-index: 1000;
      color: #0ce3ac;
      transition: all 0.2s ease-in-out;
    }

    &.trippy2:hover {
      text-decoration: none;
      transform: skewY(10deg) scaleY(5) scaleX(10) rotateZ(360deg) translateX(0px);
    }
  }

  .wobbly-content {
    -webkit-animation: wobble 5s infinite linear;
    height: 300px;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
  }

  @-webkit-keyframes wobble {
    0%  { -webkit-transform:  rotate(0deg); color: limegreen; }
    20%  { -webkit-transform:  rotate(2deg); color: purple; }
    50%  { -webkit-transform:  rotate(-2deg); color: aquamarine; }
    100%  { -webkit-transform:  rotate(0deg); color: hotpink; }
  }

  ${TransitionStyles}

`
export default GlobalStyle;
