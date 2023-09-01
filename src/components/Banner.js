// Banner.js
// A big full width banner.
//
// Params:
//  - title (optional)
//  - children: Displayed in a box in the middle.
//  - height (optional): Height the banner should be
//  - backgroundImage (optional): Fluid image to use as background
//  - background (optional): Misc content to display in the background
//  - customContent (optional): Misc content to display in the foreground

import React, { useEffect, useCallback, useRef } from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage'

export default React.memo((props) => {
  const ref = useRef()
  const fixHeader = useCallback(() => {
    const el = ref.current
    if (el) el.style.height = el.offsetHeight + 'px'
  }, [])

  // Because the banner height grows for large wavesurfer playlists,
  // we need to fix this height via JS to avoid the page jumping when
  // the player is moved into floating mode.
  useEffect(() => {
    window.addEventListener('wavesurfer_ready', fixHeader, { passive: true })
    return () => window.removeEventListener('wavesurfer_ready', fixHeader)
  }, [])

  return (
    <BannerWrapper className="banner" {...props} ref={ref}>
      {props.backgroundImage && <BackgroundImage image={props.backgroundImage} />}
      {(props.title || props.children) && (
        <BannerContent>
          <Title>
            {props.title && <h1 className="big">{props.title}</h1>}
            {props.subtitle && <h2>{props.subtitle}</h2>}
          </Title>
          {props.children}
        </BannerContent>
      )}
      {props.background && <BackgroundContent>{props.background}</BackgroundContent>}
      {props.customContent}
    </BannerWrapper>
  )
})

const BannerWrapper = styled.div`
  background: #40e0d0; /* fallback for old browsers */
  background: radial-gradient(circle, black 0%, rgba(12, 24, 33, 1) 70%);
  min-height: ${(props) => props.height || props.theme.defaultBannerHeight};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 8;
  > * {
    z-index: 1;
  }
`

const BackgroundContent = styled.div`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
`

const BannerContent = styled.div`
  flex-grow: 1;
  padding: ${rhythm(0.5)};
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  text-align: center;
  height: 100%;
  width: 100%;

  .button {
    border: 6px inset white;
    background-color: silver;
    color: black;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    &:hover {
      background-color: darkgray;
      color: black;
    }
  }

  h1 {
    color: ${(props) => props.theme.contrastColor};
  }

  h2,
  p {
    margin-bottom: 0;
  }

  .center-content {
    margin-bottom: auto;
    position: relative;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${rhythm(1)};
    padding-top: 4.5em;
    width: ${(props) => props.theme.contentContainerWidth};
    height: auto;
  }
`

const Title = styled.div`
  filter: drop-shadow(2px 2px 10px black);
  background: ${(props) => 'linear-gradient(90deg, black,' + props.theme.foregroundColor + ')'};
  border: 2px inset;
  padding: 5px;
`
