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

import React from 'react'
import styled from '@emotion/styled'
import { rhythm } from '../utils/typography'
import BackgroundImage from './BackgroundImage'

export default React.memo((props) => (
  <BannerWrapper className="banner" {...props}>
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
))

const BannerWrapper = styled.div`
  background: #40e0d0; /* fallback for old browsers */
  background: radial-gradient(circle, black 0%, rgba(12, 24, 33, 1) 70%);
  min-height: ${(props) => props.height || props.theme.defaultBannerHeight};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    padding: ${rhythm(1)};
    padding-top: 4.5em;
    width: ${(props) => props.theme.contentContainerWidth};
    height: auto;
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
`

const Title = styled.div``
