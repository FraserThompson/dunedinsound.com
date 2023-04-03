// BackgroundImage.js
// Display one or more background images.
// Params:
//  - a sharp image node or array of image nodes or normal link to an image

import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import styled from '@emotion/styled'

export default ({ image }) => (
  <BackgroundImageWrapper>
    {!Array.isArray(image) && <GatsbyImage className="backgroundImage" style={{ width: '100%', zIndex: 0, height: '100%' }} image={getImage(image)} alt="" />}
    {Array.isArray(image) &&
      image.map((image, i) => (
        <GatsbyImage key={i} className="backgroundImage" style={{ width: '100%', zIndex: 0, height: '100%' }} image={getImage(image)} alt="" />
      ))}
  </BackgroundImageWrapper>
)

const BackgroundImageWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  //max-height: 100vh;
  .backgroundImage:nth-of-type(2) {
    display: none;
  }
  .backgroundImage:nth-of-type(3) {
    display: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    .backgroundImage:nth-of-type(2) {
      display: block;
    }
    .backgroundImage:nth-of-type(3) {
      display: block;
    }
  }
`
