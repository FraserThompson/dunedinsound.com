import React from 'react'
import { graphql } from 'gatsby'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import Layout from '../components/Layout'
import Banner from '../components/Banner';
import Tile from '../components/Tile';
import Divider from '../components/Divider';
import GridContainer from '../components/GridContainer';
import HorizontalNav from '../components/HorizontalNav';

class VenueTemplate extends React.Component {
  render() {

    const post = this.props.data.thisPost
    const gigs = this.props.data.gigs.edges
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt

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

    const gigTiles = gigs.map(({ node }) => {
      const title = node.frontmatter.title || node.fields.slug
      const coverImage = node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid

      return (
        <Tile
          key={node.fields.slug}
          title={title}
          image={coverImage}
          label={node.frontmatter.date}
          href={node.fields.slug}
          height={"calc(40vh)"}
        />
      )
    });

    return (
      <Layout location={this.props.location} description={siteDescription} title={`${post.frontmatter.title} | ${siteTitle}`}>
        <Banner title={post.frontmatter.title} height="40vh" background={map}>
          <div dangerouslySetInnerHTML={{__html : post.frontmatter.description}}></div>
          <HorizontalNav>
            {post.frontmatter.facebook && <li><a className="button" href={post.frontmatter.facebook}>Facebook</a></li>}
            {post.frontmatter.bandcamp && <li><a className="button" href={post.frontmatter.bandcamp}>Bandcamp</a></li>}
            {post.frontmatter.soundcloud && <li><a className="button" href={post.frontmatter.soundcloud}>Soundcloud</a></li>}
            {post.frontmatter.Website && <li><a className="button" href={post.frontmatter.Website}>Website</a></li>}
          </HorizontalNav>
        </Banner>
        <Divider>
          <p>Gigs</p>
        </Divider>
        <GridContainer xs="6" sm="4" md="3" lg="3">
          {gigTiles}
        </GridContainer>
      </Layout>
    )
  }
}

export default VenueTemplate

export const pageQuery = graphql`
  query VenuesBySlug($slug: String!, $machine_name: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        description
        lat
        lng
        bandcamp
        facebook
        website
        soundcloud
      }
    }
    gigs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}, frontmatter: {venue: {eq: $machine_name}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            venue
            artists { name, vid {link, title} }
            title
            cover {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
