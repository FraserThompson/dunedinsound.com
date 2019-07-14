// BackgroundImage.js
// Display one or more background images.
// Params:
//  - an image node or array of image nodes

import React from 'react'
import Img from 'gatsby-image'
import { gridToSizes } from '../utils/helper'

export default props => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
    {Array.isArray(props.image) ? (
      props.image.map(({ node }) => (
        <Img
          className="backgroundImage"
          key={node.publicURL}
          style={{
            width: (1 / props.image.length) * 100 + '%',
            zIndex: 0,
            height: '100%',
          }}
          fluid={{ ...node.childImageSharp.fluid, sizes: gridToSizes({ xs: 12, md: 12 / props.image.length, lg: 12 / props.image.length }) }}
        />
      ))
    ) : (
      <Img
        className="backgroundImage"
        style={{ width: '100%', zIndex: 0, height: '100%' }}
        fluid={{ ...props.image.childImageSharp.fluid, sizes: props.sizes ? gridToSizes(props.sizes) : gridToSizes({ xs: 12, md: 12, lg: 12 }) }}
      />
    )}
  </div>
)
