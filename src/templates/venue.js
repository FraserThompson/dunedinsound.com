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
import { theme } from '../utils/theme';

class VenueTemplate extends React.Component {
  constructor(props) {
    super(props)

    this.post = this.props.data.thisPost
    this.cover = this.post.cover && this.post.cover.childImageSharp.fluid

    this.gigs = this.props.data.gigs.edges
    this.siteTitle = this.props.data.site.siteMetadata.title

    this.venueDescription = `See photos, videos and audio recordings of live gigs at ${this.post.frontmatter.title} and heaps of other local venues.`;

    // sort our filtered posts by year and month
    this.postsByDate = this.gigs.reduce((object, {node}) => {
      const splitDate = node.frontmatter.date.split("-");
      const date = new Date("20" + splitDate[2], splitDate[1] - 1, splitDate[0]);
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('en-GB', { month: 'long' });
      object[year] || (object[year] = {})
      object[year][month] || (object[year][month] = [])
      object[year][month].push(node)
      return object
    }, {})

  }
  render() {

    const position = [this.post.frontmatter.lat, this.post.frontmatter.lng]
    const map = (
      typeof window !== 'undefined' && <Map style={{height: "100%", width: "100%"}} center={position} zoom={18} zoomControl={false}>
        <TileLayer
          url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ'
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />
        <Marker position={position}>
          <Popup>{this.post.frontmatter.title}</Popup>
        </Marker>
      </Map>
    )

    const gigTiles = this.gigs && Object.keys(this.postsByDate).sort((a, b) => b - a).map(year => {
      return <React.Fragment key={year}>
        <Divider backgroundColor={theme.default.highlightColor} color="white" sticky>{year}</Divider>
        <FlexGridContainer>
          {Object.keys(this.postsByDate[year]).sort((a, b) => b - a).map(month => {
            return <React.Fragment key={month}>
                {this.postsByDate[year][month].map((node) => <GigTile node={node} key={node.fields.slug}/>)}
            </React.Fragment>
          })}
        </FlexGridContainer>
      </React.Fragment>
    })

    return (
      <Layout location={this.props.location} image={this.cover && this.cover.src} description={this.venueDescription} title={`${this.post.frontmatter.title} | ${this.siteTitle}`}>
        <Banner title={this.post.frontmatter.title} background={map}>
          <div style={{paddingBottom: rhythm(1)}} dangerouslySetInnerHTML={{__html : this.post.frontmatter.description}}></div>
          <HorizontalNav>
            {this.post.frontmatter.facebook && <li><a className="button" href={this.post.frontmatter.facebook}>Facebook</a></li>}
            {this.post.frontmatter.bandcamp && <li><a className="button" href={this.post.frontmatter.bandcamp}>Bandcamp</a></li>}
            {this.post.frontmatter.soundcloud && <li><a className="button" href={this.post.frontmatter.soundcloud}>Soundcloud</a></li>}
            {this.post.frontmatter.Website && <li><a className="button" href={this.post.frontmatter.Website}>Website</a></li>}
          </HorizontalNav>
        </Banner>
        <Divider>
          <p>Gigs ({this.gigs.length})</p>
        </Divider>
        {gigTiles}
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
