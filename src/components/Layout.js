import React from 'react'
import SiteHeader from './SiteHeader'
import styled, { ThemeProvider, createGlobalStyle } from "styled-components"
import { theme } from '../utils/theme';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    
    const GlobalStyle = createGlobalStyle`
      body {
        background-color: ${props => props.theme.backgroundColor};
        color: ${props => props.theme.textColor};
      }
    `

    const Container = styled.div`
      max-width: 100vw;
      a {
        color: #fff;
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
          color: #fff;
          text-decoration: underline;
      }
      
      a:focus {
          outline: thin dotted;
          outline: 5px auto -webkit-focus-ring-color;
          outline-offset: -2px;
      } 
    `

    return (
      <ThemeProvider theme={theme.default}>
        <Container>
          <GlobalStyle/>
          <SiteHeader/>
          {children}
        </Container>
      </ThemeProvider>
    )
  }
}

export default Layout
