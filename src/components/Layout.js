import React from 'react'
import SiteHeader from './SiteHeader'
import styled, { ThemeProvider, createGlobalStyle } from "styled-components"
import { theme } from '../utils/theme'
import 'react-image-lightbox/style.css'
import SiteFooter from './SiteFooter';
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    max-width: 100vw;
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }

  h1,h2,h3,h4 {
    text-shadow: 1px 1px #000;
  }

  h1.big {
    font-size: ${rhythm(1.5)};
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 0;
  }

  a {
    color: ${props => props.theme.textColor};
    text-decoration: none;
    background-color: transparent;

    &:active, &:hover {
      outline: 0;
    }

    &:hover, &:focus {
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: underline;
    }

    &.active {
      background-color: ${props => props.theme.highlightColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }

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

  button, .button {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 8px 12px;
    border-radius: 5px;

    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.highlightColor};

    &.active, &:active {
      background-color: ${props => props.theme.highlightColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
    }

    &:hover:not(.active) {
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }
  }
`

const SiteContainer = styled.div`
  min-height: ${props => "calc(100vh - " + props.theme.headerHeight + " - " + props.theme.footerHeight + " - " + rhythm(3) + ")"};
  background-color: ${props => props.overrideBackgroundColor};
  height: 100%;
  width: 100%;
`

class Layout extends React.Component {

  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <ThemeProvider theme={this.props.theme || theme.default}>
        <>
          <GlobalStyle/>
          <SiteHeader headerContent={this.props.headerContent} hideBrand={this.props.hideBrand}/>
          <SiteContainer overrideBackgroundColor={this.props.overrideBackgroundColor}>
            {children}
          </SiteContainer>
          <SiteFooter/>
        </>
      </ThemeProvider>
    )
  }
}

export default Layout
