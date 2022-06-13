// SiteHeader.js
// The header for the site.
// Props
//  - scrollHeaderContent (optional): Displays this in between the brand and the content when scrolled.
//  - isSidebar (optional): Pass this in if the page has a sidebar so it can leave room.
//  - headerContent (optional): Extra content to put in the header
//  - hideBrandOnMobile (optional): Hide the brand on mobile
//  - scrollHeaderOverlay (optional): Replaces the entire header with this and overlays the page with it when scrolled.
//  - backgroundColor (optional): Will use theme primaryColor if not supplied

import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import SiteNav from './SiteNav'
import { darken } from 'polished'
import { calculateScrollHeaderOffset } from '../utils/helper'

const scrollHeaderOffset = typeof window !== `undefined` && calculateScrollHeaderOffset(window)

export default React.memo(({ scrollHeaderContent, isSidebar, headerContent, hideBrandOnMobile, scrollHeaderOverlay, backgroundColor }) => {
  const [scrolled, setScrolled] = useState(false)

  const onScroll = useCallback(() => {
    if (window.pageYOffset > scrollHeaderOffset) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }, [])

  useEffect(() => {
    ;(scrollHeaderContent || scrollHeaderOverlay) && window.addEventListener('scroll', onScroll, { passive: true })
    return () => (scrollHeaderContent || scrollHeaderOverlay) && window.removeEventListener('scroll', onScroll)
  }, [])

  if (scrolled && scrollHeaderOverlay) return <OverlayContainer>{scrollHeaderOverlay}</OverlayContainer>

  return (
    <Container
      className="header"
      isSidebar={isSidebar}
      hideOnMobile={(!headerContent && !scrollHeaderContent) || (scrollHeaderContent && !scrolled)}
      backgroundColor={backgroundColor}
    >
      {!scrolled && (
        <Brand hideOnMobile={hideBrandOnMobile}>
          <Link to="/">Ōtepoti Gig Archives</Link>
        </Brand>
      )}
      {scrolled && <HeaderContent>{scrollHeaderContent}</HeaderContent>}
      {headerContent && <HeaderContent>{headerContent}</HeaderContent>}
      {!scrolled && <SiteNav className="hideMobile" />}
    </Container>
  )
})

const Container = styled.div`
  background-color: ${(props) => props.backgroundColor || props.theme.primaryColor};
  position: fixed;
  width: 100%;
  display: ${(props) => props.hideOnMobile && 'none'};
  flex-direction: row;
  justify-items: center;
  top: 0px;
  z-index: 10;
  height: ${(props) => props.theme.headerHeightMobile};
  color: ${(props) => props.theme.textColor};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid ${(props) => darken(0.025, props.theme.primaryColor)};
  padding-left: ${(props) => props.isSidebar && props.theme.headerHeightMobile};

  h1 {
    color: ${(props) => props.theme.textColor};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    display: flex;
    padding-left: 0;
    height: ${(props) => props.theme.headerHeight};
  }
`

const OverlayContainer = styled.div`
  pointer-events: none;
  display: flex;
  background-color: transparent;
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 10;
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
  display: ${(props) => props.hideOnMobile && 'none'};
  height: ${(props) => props.theme.headerHeightMobile};

  a {
    color: ${(props) => props.theme.textColor};
    padding: ${rhythm(0.5)};
    line-height: ${(props) => props.theme.headerHeight};
    &:hover {
      text-decoration: none;
      color: ${(props) => props.theme.secondaryColor};
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    height: ${(props) => props.theme.headerHeight};
  }
  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: block;
  }
`
