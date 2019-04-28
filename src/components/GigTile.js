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
import styled from 'styled-components'
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

class GigTile extends React.PureComponent {

  render() {
    const { node } = this.props
    const title = this.props.title || this.props.node.frontmatter.title || this.props.node.fields.slug
    const artists = this.props.node.frontmatter.artists.map(artist => artist.name).join(", ")
    const videoCount = this.props.node.frontmatter.artists.reduce((count, artist) => { return count + (artist.vid ? artist.vid.length : 0)}, 0)

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
            id={this.props.id}
            key={this.props.node.fields.slug}
            title={title}
            subtitle={artists}
            image={this.props.node.frontmatter.cover}
            label={this.props.node.frontmatter.date}
            width={this.props.width}
            height={this.props.height}
            href={this.props.node.fields.slug}
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
}

export default GigTile
