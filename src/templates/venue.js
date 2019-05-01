import React from 'react'
import { graphql } from 'gatsby'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import ContentByEntityTemplate from './templatetemplates/contentByEntity'

class VenueTemplate extends ContentByEntityTemplate {

  constructor(props) {
    super(props)

    this.parent = {
      title: "Venues",
      href: "/venues/"
    }

    this.pageDescription = `See photos, videos and audio recordings of live gigs at ${this.post.frontmatter.title} and heaps of other local venues.`
    const position = [this.post.frontmatter.lat, this.post.frontmatter.lng]
    this.background = (
      typeof window !== 'undefined' && <Map style={{height: "100%", width: "100%"}} center={position} zoom={18} zoomControl={false} dragging={false} touchZoom={false} scrollWheelZoom={false} keyboard={false}>
        <TileLayer
          url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ'
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />
        <Marker position={position}>
          <Popup>{this.post.frontmatter.title}</Popup>
        </Marker>
      </Map>
    )
  }
}

export default VenueTemplate

export const pageQuery = graphql`
  query VenuesBySlug($slug: String!, $machine_name: String!) {
    site {
      ...SiteInformation
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...VenueFrontmatter
    }
    gigs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}, frontmatter: {venue: {eq: $machine_name}}}) {
      group(field:fields___year) {
      fieldValue
        edges {
          node {
            ...GigTileFrontmatter
          }
        }
      }
    }
  }
`
