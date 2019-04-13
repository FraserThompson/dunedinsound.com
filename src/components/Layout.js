import React from 'react'
import SiteHeader from './SiteHeader'
import styled, { ThemeProvider, createGlobalStyle } from "styled-components"
import { theme } from '../utils/theme'
import 'react-image-lightbox/style.css'
import SiteFooter from './SiteFooter';
import { rhythm } from '../utils/typography';
import { lighten } from 'polished';
import TransitionStyles from './TransitionStyles';
import { Helmet } from 'react-helmet';
import SiteNav from './SiteNav';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    max-width: 100vw;
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }

  h1.big {
    font-size: ${rhythm(1.5)};
    text-align: center;
    text-overflow: ellipsis;
    overflow: none;
    text-transform: uppercase;
    margin-bottom: 0;
    text-shadow: -1px -1px 0 rgba(0,0,0,.3);

    @media screen and (min-width: 992px) {
      font-size: ${rhythm(2.5)};
    }

  }

  progress {
    -webkit-appearance: none;
    appearance: none;
  }

  h1.semi-big {
    font-size: ${rhythm(1.5)};
    text-align: center;
    text-overflow: ellipsis;
    overflow: none;
    text-transform: uppercase;
    margin-bottom: 0;
    margin-left: ${rhythm(0.5)};

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
    color: ${props => props.theme.textColor};
    text-decoration: none;
    overflow:hidden;
    background-color: transparent;

    &:active, &:hover {
      outline: 0;
    }

    &:hover, &:focus {
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
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

    &.subtle {
      padding-top: 0px;
      padding-bottom: 0px;
      padding-right: ${rhythm(0.5)};
      padding-left: ${rhythm(0.5)};
      color: ${props => props.theme.textColor};
      background-color: transparent;
      border-color: ${props => props.theme.highlightColor2};
    }

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

const MobileNav = styled.div`
  display: initial;
  position: fixed;
  top: 0px;
  height: ${props => props.theme.headerHeightMobile};
  background-color: ${props => props.theme.headerColor};
  z-index: 12;
  width: 100%;
  @media screen and (min-width: 768px) {
    display: none;
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
          <Helmet
            htmlAttributes={{ lang: 'en' }}
            meta={[{ name: 'description', content: this.props.description }]}
            title={this.props.title}
          />
          <GlobalStyle/>
          <SiteHeader
            backgroundColor={this.props.headerColor}
            headerContent={this.props.headerContent}
            hideBrand={this.props.hideBrand}
            hideNav={this.props.hideNav}
          />
          <SiteContainer overrideBackgroundColor={this.props.overrideBackgroundColor}>
            {children}
          </SiteContainer>
          {!this.props.hideFooter && <SiteFooter/> }
          <MobileNav>
            <SiteNav height={theme.default.headerHeightMobile}/>
          </MobileNav>
        </>
      </ThemeProvider>
    )
  }
}

export default Layout
