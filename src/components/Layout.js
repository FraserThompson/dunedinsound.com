import React from 'react'
import SiteHeader from './SiteHeader'
import styled, { ThemeProvider, createGlobalStyle } from "styled-components"
import { theme } from '../utils/theme'
import 'react-image-lightbox/style.css'
import SiteFooter from './SiteFooter';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    max-width: 100vw;
    height: 100%;
    width: 100%;
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
`

const Container = styled.div`
  min-height: 80vh;
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
