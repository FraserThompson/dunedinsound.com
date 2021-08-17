// BackToTop.js
// Displays a fixed button on screen which appears after scrolling down and scrolls back up.

import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { FaChevronUp } from 'react-icons/fa'

export default React.memo(() => {
  const [scrolled, setScrolled] = useState(false)

  const onScroll = useCallback(() => {
    const vh = document.querySelector('.SiteContainer') ? document.querySelector('.SiteContainer').clientHeight : 0
    if (window.pageYOffset > vh * 0.6) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = React.useCallback(() => typeof window !== `undefined` && window.scrollTo(0, 0))
  return (
    scrolled && (
      <BackToTopButton onClick={scrollToTop}>
        <FaChevronUp />
      </BackToTopButton>
    )
  )
})

const BackToTopButton = styled.button`
  position: fixed;
  z-index: 6;
  padding: 0;
  bottom: ${(props) => `calc(${props.theme.headerHeightMobile} + 10px)`};
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  > svg {
    width: 60%;
    height: 100%;
  }
  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    bottom: 10px;
    width: 60px;
    height: 60px;
  }
`
