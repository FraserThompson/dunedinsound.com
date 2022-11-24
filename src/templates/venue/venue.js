import React from 'react'
import { graphql } from 'gatsby'
import ContentByEntity from '../contentbyentity/ContentByEntity'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { deadIcon } from './MapMarkers'
import { MapWrapper } from '../../components/MapWrapper'
import { SiteHead } from '../../components/SiteHead'

const Page = React.memo(({ data }) => {
  const parent = {
    title: 'Venues',
    href: '/venues/',
  }

  const position = {
    latitude: data.thisPost.frontmatter.lat,
    longitude: data.thisPost.frontmatter.lng,
    zoom: 18,
  }

  const background = typeof window !== 'undefined' && (
    <MapWrapper>
      <Map
        initialViewState={position}
        style={{ width: '100%', height: '100%' }}
        mapboxAccessToken="pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactive={false}
      >
        <Marker
          longitude={position.longitude}
          latitude={position.latitude}
          color={data.thisPost.frontmatter.died == undefined ? '#367e80' : 'white'}
          anchor="bottom"
        >
          {data.thisPost.frontmatter.died != undefined ? deadIcon : null}
        </Marker>
      </Map>
    </MapWrapper>
  )

  return <ContentByEntity parent={parent} data={data} background={background} />
})

export const Head = (params) => {
  const cover = params.data.images && params.data.images.edges.length !== 0 && params.data.images.edges[0].node
  const title = `${params.data.thisPost.frontmatter.title} | ${params.data.site.siteMetadata.title}`

  return (
    <SiteHead
      title={title}
      description={`See photos, videos and audio recordings of live gigs at ${params.data.thisPost.frontmatter.title} and heaps of other local venues.`}
      cover={cover}
      {...params}
    />
  )
}

export const pageQuery = graphql`
  query VenuesBySlug($slug: String!, $machine_name: String!, $title: String!) {
    site {
      ...SiteInformation
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...VenueFrontmatter
    }
    blogs: allMarkdownRemark(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } }, frontmatter: { tags: { eq: $title } } }) {
      edges {
        node {
          ...BlogFrontmatter
        }
      }
    }
    gigs: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { type: { eq: "gigs" } }, frontmatter: { venue: { eq: $machine_name } } }
    ) {
      group(field: { fields: { year: SELECT } }) {
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
