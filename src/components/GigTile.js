// GigTile.js
// A tile used for gigs.
//
// Params:
//  - node: The gig node.
//  - title: The title
//  - width
//  - height
//  - id (optional)

import React from 'react'
import Tile from './Tile'

export default React.memo(({ node, title, id, width, height, hoverHeight, feature }) => {
  const tileTitle = title || node.title || node.fields.slug
  const artists = node.artists
    .map((artist, i) => {
      if (i == node.artists.length - 1) {
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
      coverDir={node.fields.fileName}
      label={node.date}
      width={width}
      height={height}
      hoverHeight={hoverHeight}
      to={node.fields.slug}
      feature={feature}
      prefix={'GIG '}
    ></Tile>
  )
})
