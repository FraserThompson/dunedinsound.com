import React from 'react'
import { graphql } from 'gatsby'
import ContentByEntity from '../contentbyentity/ContentByEntity'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { deadIcon, livingIcon } from './MapMarkers'
import { MapWrapper } from '../../components/MapWrapper'

const Page = React.memo(({ data }) => {
  const parent = {
    title: 'Venues',
    href: '/venues/',
  }
  const pageDescription = `See photos, videos and audio recordings of live gigs at ${data.thisPost.frontmatter.title} and heaps of other local venues.`

  const position = [data.thisPost.frontmatter.lat, data.thisPost.frontmatter.lng]
  const background = typeof window !== 'undefined' && (
    <MapWrapper>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={position}
        zoom={18}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        keyboard={false}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />
        <Marker position={position} icon={data.thisPost.frontmatter.died == undefined ? livingIcon : deadIcon} />
      </MapContainer>
    </MapWrapper>
  )

  return <ContentByEntity pageDescription={pageDescription} parent={parent} data={data} background={background} />
})

export const pageQuery = graphql`
  query VenuesBySlug($slug: String!, $machine_name: String!, $title: String!) {
    site {
      ...SiteInformation
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...VenueFrontmatter
    }
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "blog" } }, frontmatter: { tags: { eq: $title } } }
    ) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
    gigs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "gigs" } }, frontmatter: { venue: { eq: $machine_name } } }
    ) {
      group(field: fields___year) {
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

export default Page
