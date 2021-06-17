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

export default React.memo(props => (
  <BannerWrapper className="banner" {...props}>
    {props.backgroundImage && <BackgroundImage image={props.backgroundImage} />}
    {(props.title || props.children) && (
      <BannerText>
        <Title>
          {props.title && <h1 className="big">{props.title}</h1>}
          {props.subtitle && <h2>{props.subtitle}</h2>}
        </Title>
        {props.children && <div className="center-content">{props.children}</div>}
      </BannerText>
    )}
    {props.background && <div className="background">{props.background}</div>}
    {props.customContent}
  </BannerWrapper>
))

const BannerWrapper = styled.div`
  background: #40e0d0; /* fallback for old browsers */
  background: radial-gradient(circle, rgba(236, 64, 103, 1) 0%, rgba(12, 24, 33, 1) 70%);
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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 20%, rgba(0, 0, 0, 0) 40%);
  padding: ${rhythm(0.5)};
  height: 100%;
  width: 100%;

  .button {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    padding: ${rhythm(1)};
    background: rgba(0, 0, 0, 0.8);
    width: ${props => props.theme.contentContainerWidth};
    height: auto;
  }

  h1 {
    color: ${props => props.theme.contrastColor};
  }

  h2, p{
    margin-bottom: 0;
  }

  .center-content {
    padding-top: ${rhythm(1)};
    margin-bottom: auto;
    position: relative;
  }
`

const Title = styled.div`
  margin-bottom: auto;
`
