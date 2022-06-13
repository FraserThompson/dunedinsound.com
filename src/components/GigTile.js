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
  const artists = node.frontmatter.artists
    .map((artist, i) => {
      if (i == node.frontmatter.artists.length - 1) {
        return ' and <strong>' + artist.name + '</strong>'
      } else {
        return '<strong>' + artist.name + '</strong>, '
      }
    })
    .join('')

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
      prefix={'GIG: '}
    ></Tile>
  )
})
