import React from 'react'
import { graphql } from 'gatsby'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import Layout from '../components/Layout'
import Banner from '../components/Banner';
import Divider from '../components/Divider';
import HorizontalNav from '../components/HorizontalNav';
import { rhythm } from '../utils/typography';
import GigTile from '../components/GigTile';
import FlexGridContainer from '../components/FlexGridContainer';

class VenueTemplate extends React.Component {
  render() {

    const post = this.props.data.thisPost
    const cover = post.cover && post.cover.childImageSharp.fluid

    const gigs = this.props.data.gigs.edges
    const siteTitle = this.props.data.site.siteMetadata.title

    const venueDescription = `See photos, videos and audio recordings of live gigs at ${post.frontmatter.title} and heaps of other local venues.`;

    const position = [post.frontmatter.lat, post.frontmatter.lng]
    const map = (
      typeof window !== 'undefined' && <Map style={{height: "100%", width: "100%"}} center={position} zoom={18} zoomControl={false}>
        <TileLayer
          url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ'
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />
        <Marker position={position}>
          <Popup>{post.frontmatter.title}</Popup>
        </Marker>
      </Map>
    )

    const gigTiles = gigs.map(({ node }) => <GigTile node={node} height="40vh" key={node.fields.slug}/>)

    return (
      <Layout location={this.props.location} image={cover && cover.src} description={venueDescription} title={`${post.frontmatter.title} | ${siteTitle}`}>
        <Banner title={post.frontmatter.title} height="40vh" background={map}>
          <div style={{paddingBottom: rhythm(1)}} dangerouslySetInnerHTML={{__html : post.frontmatter.description}}></div>
          <HorizontalNav>
            {post.frontmatter.facebook && <li><a className="button" href={post.frontmatter.facebook}>Facebook</a></li>}
            {post.frontmatter.bandcamp && <li><a className="button" href={post.frontmatter.bandcamp}>Bandcamp</a></li>}
            {post.frontmatter.soundcloud && <li><a className="button" href={post.frontmatter.soundcloud}>Soundcloud</a></li>}
            {post.frontmatter.Website && <li><a className="button" href={post.frontmatter.Website}>Website</a></li>}
          </HorizontalNav>
        </Banner>
        <Divider>
          <p>Gigs ({gigs.length})</p>
        </Divider>
        <FlexGridContainer xs="6" sm="4" md="3" lg="3">
          {gigTiles}
        </FlexGridContainer>
      </Layout>
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
      edges {
        node {
          ...GigFrontmatter
        }
      }
    }
  }
`
