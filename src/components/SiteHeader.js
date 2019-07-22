// SiteHeader.js
// The header for the site.
// Props
//  - backgroundColor (optional): Will use theme primaryColor if not supplied
//  - hideOnMobile (optional): Whether to hide it on mobile
//  - headerContent (optional): Extra content to put in the header
//  - hideBrand (optional): Hide the brand
//  - hideNav (optional): Hide the navigation

import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import SiteNav from './SiteNav'
import { darken } from 'polished'
import { calculateScrollHeaderOffset } from '../utils/helper'

const scrollHeaderOffset = typeof window !== `undefined` && calculateScrollHeaderOffset(window)

export default React.memo(({ scrollHeaderContent, isSidebar, headerContent, hideBrandOnMobile, backgroundColor }) => {
  const [scrolled, setScrolled] = useState(false)

  const onScroll = useCallback(() => {
    if (window.pageYOffset > scrollHeaderOffset) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }, [])

  useEffect(() => {
    scrollHeaderContent && window.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollHeaderContent && window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Container className="header" isSidebar={isSidebar} hideOnMobile={(scrollHeaderContent && !scrolled) || !headerContent} backgroundColor={backgroundColor}>
      {!scrolled && (
        <Brand hideOnMobile={hideBrandOnMobile}>
          <Link to="/">Dunedin Gig Archives</Link>
        </Brand>
      )}
      {scrolled && <HeaderContent>{scrollHeaderContent}</HeaderContent>}
      {headerContent && <HeaderContent>{headerContent}</HeaderContent>}
      {!scrolled && <SiteNav className="hideMobile" />}
    </Container>
  )
})

const Container = styled.div`
  background-color: ${props => props.backgroundColor || props.theme.primaryColor};
  position: sticky;
  width: 100%;
  display: ${props => props.hideOnMobile && 'none'};
  flex-direction: row;
  justify-items: center;
  top: 0px;
  z-index: 10;
  height: ${props => props.theme.headerHeight};
  color: ${props => props.theme.textColor};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid ${props => darken(0.025, props.theme.primaryColor)};
  padding-left: ${props => props.isSidebar && props.theme.headerHeightMobile};

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    display: flex;
    padding-left: 0;
  }

  h1 {
    color: ${props => props.theme.textColor};
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
  display: ${props => props.hideOnMobile && 'none'};
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
