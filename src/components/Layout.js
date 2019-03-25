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

  a {
    color: ${props => props.theme.textColor};
    text-decoration: none;
    background-color: transparent;
  }

  a:active, a:hover {
      outline: 0;
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

  a:hover, a:focus {
    color: ${props => props.theme.textColor};
    text-decoration: underline;
  }

  a:focus {
      outline: thin dotted;
      outline: 5px auto -webkit-focus-ring-color;
      outline-offset: -2px;
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
    background: ${props => props.theme.highlightColor2};
    color: ${props => props.theme.textColor};
    &:hover {
      background: ${props => lighten(0.1, props.theme.highlightColor2)};
      text-decoration: none;
    }
  }
`

const Container = styled.div`
  min-height: ${props => "calc(100vh - " + props.theme.headerHeight + " - " + props.theme.footerHeight + " - " + rhythm(3) + ")"};
  height: 100%;
  width: 100%;
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <ThemeProvider theme={theme.default}>
        <>
          <GlobalStyle/>
          <SiteHeader/>
          <Container>
            {children}
          </Container>
          <SiteFooter/>
        </>
      </ThemeProvider>
    )
  }
}

export default Layout
