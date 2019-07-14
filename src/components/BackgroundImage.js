// BackgroundImage.js
// Display one or more background images.
// Params:
//  - a sharp image node or array of image nodes or normal link to an image

import React from 'react'
import Img from 'gatsby-image'
import { gridToSizes } from '../utils/helper'

export default ({ image, sizes }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
    {Array.isArray(image) ? (
      image.map(({ node }) => (
        <Img
          className="backgroundImage"
          key={node.publicURL}
          style={{
            width: (1 / image.length) * 100 + '%',
            zIndex: 0,
            height: '100%',
          }}
          fluid={{ ...node.childImageSharp.fluid, sizes: gridToSizes({ xs: 12, md: 12 / image.length, lg: 12 / image.length }) }}
        />
      ))
    ) : image.childImageSharp ? (
      <Img
        className="backgroundImage"
        style={{ width: '100%', zIndex: 0, height: '100%' }}
        fluid={{ ...image.childImageSharp.fluid, sizes: sizes ? gridToSizes(sizes) : gridToSizes({ xs: 12, md: 12, lg: 12 }) }}
      />
    ) : (
      <img className="backgroundImage" src={image} />
    )}
  </div>
)
