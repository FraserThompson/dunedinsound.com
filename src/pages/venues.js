import React, { useState, useCallback, useMemo } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import styled from '@emotion/styled'
import { Map, Popup, TileLayer, Marker } from 'react-leaflet'
import SidebarNav from '../components/SidebarNav'
import Search from '../components/Search'
import HorizontalNav from '../components/HorizontalNav'

const Sidebar = React.memo(({ menuItems, menuItemClick, setRef, selected }) => {
  const [open, setOpen] = useState(true)

  const toggleSidebar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const click = useCallback(
    (index, center) => {
      setOpen(true)
      menuItemClick && menuItemClick(index, center)
    },
    [menuItemClick]
  )

  return (
    <SidebarNav toggle={toggleSidebar} open={open} left>
      <ul>
        {menuItems.map(({ node }, index) => (
          <li key={index} ref={setRef} className={index === selected ? 'active' : ''}>
            <a onClick={() => click(index, [node.frontmatter.lat, node.frontmatter.lng])}>{node.frontmatter.title}</a>
          </li>
        ))}
      </ul>
    </SidebarNav>
  )
})

export default ({ data, location }) => {
  const imageCountByGig = useMemo(
    () =>
      data.gigCountByVenue['group'].reduce((obj, item) => {
        obj[item.fieldValue] = item.totalCount
        return obj
      }),
    [data]
  )

  const [filteredPosts, setFilteredPosts] = useState(data.allVenues.edges)
  const [selected, setSelected] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(13)
  const [center, setCenter] = useState([-45.8745557, 170.5016047]) // the octagon
  const [listRefs, setListRefs] = useState([])

  const openPopup = useCallback(
    (marker, index) => {
      if (marker && marker.leafletElement && index === selected) {
        marker.leafletElement.openPopup()
      }
    },
    [selected]
  )

  const select = useCallback((index, center) => {
    setSelected(index)
    setZoomLevel(18)
    setCenter(center)
  }, [])

  const markerClick = useCallback(
    index => {
      listRefs[index].scrollIntoView({ behavior: 'smooth' })
      setSelected(index)
    },
    [listRefs]
  )

  const filter = useCallback(
    searchInput => {
      if (!searchInput || searchInput.length == 0) {
        const filteredPosts = data.allVenues.edges
        setFilteredPosts(filteredPosts)
      } else {
        const filteredPosts = data.allVenues.edges.filter(({ node }) => node.frontmatter.title.toLowerCase().includes(searchInput))
        setFilteredPosts(filteredPosts)
      }
    },
    [data.allVenues.edges]
  )

  const setRef = useCallback(
    ref => {
      const newRefs = listRefs
      newRefs.push(ref)
      setListRefs(newRefs)
    },
    [listRefs]
  )

  return (
    <Layout
      description={data.site.siteMetadata.description}
      location={location}
      title={`Venues | ${data.site.siteMetadata.title}`}
      hideBrandOnMobile={true}
      hideFooter={true}
      isSidebar={true}
      headerContent={<Search placeholder="Search venues" filter={filter} />}
    >
      <Sidebar menuItems={filteredPosts} menuItemClick={select} setRef={setRef} selected={selected} />
      <MapWrapper>
        {typeof window !== 'undefined' && (
          <Map style={{ height: '100%', width: '100%' }} center={center} zoom={zoomLevel}>
            <TileLayer
              url="https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
              attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
            />
            {filteredPosts.map(({ node }, index) => (
              <Marker ref={marker => openPopup(marker, index)} key={index} position={[node.frontmatter.lat, node.frontmatter.lng]}>
                <Popup onOpen={() => markerClick(index)}>
                  <h3>{node.frontmatter.title}</h3>
                  {node.frontmatter.description && <p dangerouslySetInnerHTML={{ __html: node.frontmatter.description }}></p>}
                  <h4>
                    <Link to={node.fields.slug}>
                      {node.frontmatter.cover && <Img fluid={node.frontmatter.cover.childImageSharp.fluid} />}
                      View {imageCountByGig[node.fields.machine_name]} gigs at this venue
                    </Link>
                  </h4>
                  <HorizontalNav>
                    {node.frontmatter.facebook && (
                      <li>
                        <a href={node.frontmatter.facebook}>Facebook</a>
                      </li>
                    )}
                    {node.frontmatter.bandcamp && (
                      <li>
                        <a href={node.frontmatter.bandcamp}>Bandcamp</a>
                      </li>
                    )}
                    {node.frontmatter.soundcloud && (
                      <li>
                        <a href={node.frontmatter.soundcloud}>Soundcloud</a>
                      </li>
                    )}
                    {node.frontmatter.Website && (
                      <li>
                        <a href={node.frontmatter.Website}>Website</a>
                      </li>
                    )}
                  </HorizontalNav>
                </Popup>
              </Marker>
            ))}
          </Map>
        )}
      </MapWrapper>
    </Layout>
  )
}

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 5;
`

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allVenues: allMarkdownRemark(sort: { fields: [frontmatter___title], order: ASC }, filter: { fields: { type: { eq: "venues" } } }) {
      edges {
        node {
          ...VenueFrontmatter
        }
      }
    }
    gigCountByVenue: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: { fields: { type: { eq: "gigs" } } }) {
      group(field: frontmatter___venue) {
        fieldValue
        totalCount
      }
    }
  }
`
