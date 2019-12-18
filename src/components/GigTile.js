// GigTile.js
// A tile used for gigs.
//
// Params:
//  - node: The gig node.
//  - width
//  - height
//  - id (optional)

import React from 'react'
import Tile from './Tile'

export default React.memo(({ node, title, id, imageSizes, width, height, hoverHeight }) => {
  const tileTitle = title || node.frontmatter.title || node.fields.slug
  const artists = node.frontmatter.artists.map(artist => artist.name).join(', ')

  return (
    <Tile
      id={id}
      key={node.fields.slug}
      title={tileTitle}
      subtitle={artists}
      image={node.frontmatter.cover}
      imageSizes={imageSizes}
      label={node.frontmatter.date}
      width={width}
      height={height}
      hoverHeight={hoverHeight}
      to={node.fields.slug}
    ></Tile>
  )
})
