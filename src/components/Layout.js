import React from 'react'
import SiteHeader from './SiteHeader'
import styled from "styled-components"
import { rhythm, scale } from '../utils/typography'
import { ThemeContext, theme } from '../utils/theme';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

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
      <ThemeContext.Provider value={theme.default}>
        <Container>
          <SiteHeader/>
          {children}
        </Container>
      </ThemeContext.Provider>
    )
  }
}

export default Layout
