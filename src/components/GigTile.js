// GigTile.js
// A tile used for gigs.
//
// Params:
//  - node: The gig node.
//  - width
//  - height
//  - id (optional)

import { StaticQuery, graphql } from 'gatsby'
import React from 'react'
import styled from '@emotion/styled'
import Tile from './Tile';
import { MdPhotoCamera, MdAudiotrack, MdVideocam } from 'react-icons/md'

const MediaCounts = styled.div`
  position: absolute;
  color: ${props => props.theme.textColor};
  top: 0px;
  right: 0px;
  text-align: right;
  > div {
    display: block;
  }
  svg {
    vertical-align: middle;
  }
`

export default (props) => {

  const { node } = props
  const title = props.title || props.node.frontmatter.title || props.node.fields.slug
  const artists = props.node.frontmatter.artists.map(artist => artist.name).join(", ")
  const videoCount = props.node.frontmatter.artists.reduce((count, artist) => { return count + (artist.vid ? artist.vid.length : 0)}, 0)

  return (
    <StaticQuery
      query={graphql`
        query CountsQuery {
          imageCountByGig: allFile( filter: {extension: {in: ["jpg", "JPG"]}, fields: { type: { eq: "gigs"}}}) {
            group(field: fields___gigDir) {
              fieldValue
              totalCount
            }
          }
          audioCountByGig: allFile( filter: {extension: {eq: "mp3"}, fields: { type: { eq: "gigs"}}}) {
            group(field: fields___gigDir) {
              fieldValue
              totalCount
            }
          }
        }
      `}
      render={data => {

        const imageCountByGig = data.imageCountByGig['group'].reduce((obj, item) => {
          obj[item.fieldValue] = item.totalCount
          return obj
        })

        const audioCountByGig = data.audioCountByGig['group'].reduce((obj, item) => {
          obj[item.fieldValue] = item.totalCount
          return obj
        })

        return (<Tile
          id={props.id}
          key={props.node.fields.slug}
          title={title}
          subtitle={artists}
          image={props.node.frontmatter.cover}
          imageSizes={props.imageSizes}
          maxImageSize={props.maxImageSize}
          label={props.node.frontmatter.date}
          width={props.width}
          height={props.height}
          href={props.node.fields.slug}
        >
          <MediaCounts>
            {imageCountByGig[node.fields.parentDir] > 0 && <div><span className="smaller">{imageCountByGig[node.fields.parentDir]}</span> <MdPhotoCamera/> </div>}
            {audioCountByGig[node.fields.parentDir] > 0 &&  <div><span className="smaller">{audioCountByGig[node.fields.parentDir]}</span> <MdAudiotrack/></div>}
            {videoCount > 0 && <div><span className="smaller">{videoCount}</span> <MdVideocam/></div>}
          </MediaCounts>
        </Tile>
        )
      }}
    />
  )
}
