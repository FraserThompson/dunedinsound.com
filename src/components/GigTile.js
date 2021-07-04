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

export default React.memo(({ node, title, id, width, height, hoverHeight, feature }) => {
  const tileTitle = title || node.frontmatter.title || node.fields.slug
  const artists = node.frontmatter.artists.map(artist => artist.name).join('<br/> ')

  return (
    <Tile
      id={id}
      key={node.fields.slug}
      title={tileTitle}
      subtitle={artists}
      image={node.frontmatter.cover}
      label={node.frontmatter.date}
      width={width}
      height={height}
      hoverHeight={hoverHeight}
      to={node.fields.slug}
      feature={feature}
    ></Tile>
  )
})
