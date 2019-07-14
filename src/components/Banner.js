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

const BannerWrapper = styled.div`
  background: #40e0d0; /* fallback for old browsers */
  background: linear-gradient(to right, #ff0080, #ff8c00, #40e0d0);
  height: ${props => (props.height ? props.height : props.theme.defaultBannerHeight)};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > * {
    z-index: 1;
  }
  .background {
    z-index: 0;
    width: 100%;
    height: 100%;
  }
`
const BannerText = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  text-align: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  padding: ${rhythm(0.5)};
  width: 100%;
  height: 100%;

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    padding: ${rhythm(1)};
    width: auto;
    height: auto;
  }

  h1 {
    color: ${props => props.theme.contrastColor};
  }

  .center-content {
    padding-top: ${rhythm(1)};
    position: relative;
  }
`

export default React.memo(props => (
  <BannerWrapper className="banner" {...props}>
    {props.backgroundImage && <BackgroundImage image={props.backgroundImage} />}
    {(props.title || props.children) && (
      <BannerText>
        {props.title && <h1 className="big">{props.title}</h1>}
        {props.children && <div className="center-content">{props.children}</div>}
      </BannerText>
    )}
    {props.background && <div className="background">{props.background}</div>}
    {props.customContent}
  </BannerWrapper>
))
