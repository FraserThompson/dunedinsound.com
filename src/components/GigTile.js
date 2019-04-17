import React from 'react'
import styled from 'styled-components'
import Tile from './Tile';
import { MdPhotoCamera, MdAudiotrack, MdVideocam } from 'react-icons/md';

const MediaCounts = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  > div {
    display: block;
  }
  svg {
    vertical-align: middle;
  }
`

const GigTile = props => {

  const title = props.title || props.node.frontmatter.title || props.node.fields.slug
  const artists = props.node.frontmatter.artists.map(artist => artist.name).join(", ")
  const videoCount = props.node.frontmatter.artists.reduce((count, artist) => { return count + (artist.vid ? artist.vid.length : 0)}, 0)

  return (
    <Tile
      key={props.node.fields.slug}
      title={title}
      subtitle={artists}
      customContent={
        <MediaCounts>
          {props.imageCount > 0 && <div><MdPhotoCamera/> <span className="smaller">{props.imageCount}</span></div>}
          {props.audioCount > 0 &&  <div><MdAudiotrack/> <span className="smaller">{props.audioCount}</span></div>}
          {videoCount > 0 && <div><MdVideocam/> <span className="smaller">{videoCount}</span></div>}
        </MediaCounts>
      }
      image={props.node.frontmatter.cover && props.node.frontmatter.cover.childImageSharp.fluid}
      label={props.node.frontmatter.date}
      height={props.height}
      href={props.node.fields.slug}
    />
  )
}

export default GigTile
