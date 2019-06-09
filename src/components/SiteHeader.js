// SiteHeader.js
// The header for the site.
// Props
//  - backgroundColor (optional): Will use theme primaryColor if not supplied
//  - hideOnMobile (optional): Whether to hide it on mobile
//  - headerContent (optional): Extra content to put in the header
//  - hideBrand (optional): Hide the brand
//  - hideNav (optional): Hide the navigation

import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import SiteNav from './SiteNav'
import { darken } from 'polished'

const Container = styled.div`
  background-color: ${props => props.backgroundColor || props.theme.primaryColor};
  position: sticky;
  width: 100%;
  display: ${props => props.hideOnMobile && "none"};
  flex-direction: row;
  justify-items: center;
  top: 0px;
  z-index: 10;
  height: ${props => props.theme.headerHeight};
  color: ${props => props.theme.textColor};
  box-shadow: 0 6px 12px rgba(0,0,0,.25);
  border-bottom: 1px solid ${props => darken(0.025, props.theme.primaryColor)};

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    display: flex;
  }

  h1 {
    color: ${props => props.theme.textColor}
  }
`

const HeaderContent = styled.div`
  margin: 0 auto;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
`

const Brand = styled.div`
  margin-right: auto;
  display: ${props => props.hideOnMobile && "none"};
  height: ${props => props.theme.headerHeight};

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }

  a {
    color: ${props => props.theme.textColor};
    padding: ${rhythm(0.5)};
    line-height: ${props => props.theme.headerHeight};
    &:hover {
      text-decoration: none;
      color: ${props => props.theme.secondaryColor};
    }
  }
`

class SiteHeader extends React.Component {

  render() {
    return (
      <Container className="header" hideOnMobile={!this.props.headerContent} backgroundColor={this.props.backgroundColor}>
        {!this.props.hideBrand && <Brand hideOnMobile={this.props.hideBrandOnMobile}><Link to="/">Dunedin Gig Archives</Link></Brand>}
        {this.props.headerContent && <HeaderContent>{this.props.headerContent}</HeaderContent>}
        {!this.props.hideNav && <SiteNav className="hideMobile"/>}
      </Container>
    )
  }
}

export default SiteHeader
