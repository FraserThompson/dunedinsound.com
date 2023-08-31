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
    latitude: data.thisPost.lat,
    longitude: data.thisPost.lng,
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
        <Marker longitude={position.longitude} latitude={position.latitude} color={data.thisPost.died === null ? '#367e80' : 'white'} anchor="bottom">
          {data.thisPost.died !== null ? deadIcon : null}
        </Marker>
      </Map>
    </MapWrapper>
  )

  return <ContentByEntity parent={parent} data={data} background={background} />
})

export const Head = (params) => {
  const cover = params.data.images && params.data.images.nodes.length !== 0 && params.data.images.nodes[0]

  return (
    <SiteHead
      title={params.data.thisPost.title}
      description={`See photos, videos and audio recordings of live gigs at ${params.data.thisPost.title} and heaps of other local venues.`}
      cover={cover}
      {...params}
    />
  )
}

export const pageQuery = graphql`
  query Venue($slug: String!, $fileName: String!, $title: String!) {
    thisPost: venueYaml(fields: { slug: { eq: $slug } }) {
      ...VenueFrontmatter
    }
    blogs: allMdx(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } }, frontmatter: { tags: { eq: $title } } }) {
      nodes {
        ...BlogFrontmatter
      }
    }
    images: allFile(
      filter: { sourceInstanceName: { eq: "media" }, extension: { in: ["jpg", "JPG"] }, fields: { mediaDir: { eq: "venue" }, parentDir: { eq: $fileName } } }
    ) {
      nodes {
        ...LargeImage
      }
    }
    gigs: allGigYaml(sort: { date: DESC }, filter: { venue: { eq: $fileName } }) {
      group(field: { fields: { year: SELECT } }) {
        fieldValue
        nodes {
          ...GigTileFrontmatter
        }
      }
    }
  }
`

export default Page
