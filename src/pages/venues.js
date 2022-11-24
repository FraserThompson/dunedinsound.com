import React, { useState, useCallback, useMemo, useEffect, Fragment } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import styled from '@emotion/styled'
import 'mapbox-gl/dist/mapbox-gl.css'
import SidebarNav from '../components/SidebarNav'
import Search from '../components/Search'
import HorizontalNav from '../components/HorizontalNav'
import { lighten } from 'polished'
import ActiveIndicator from '../components/ActiveIndicator'
import { rhythm } from '../utils/typography'
import { deadIcon } from '../templates/venue/MapMarkers'
import { MapWrapper } from '../components/MapWrapper'
import { SiteHead } from '../components/SiteHead'
import Map, { Marker, Popup } from 'react-map-gl'

const Sidebar = React.memo(({ menuItems, menuItemClick, setRef, selected }) => {
  const [open, setOpen] = useState(true)

  const toggleSidebar = useCallback(() => {
    setOpen(!open)
  }, [open])

  const click = useCallback(
    (index) => {
      setOpen(true)
      menuItemClick && menuItemClick(index)
    },
    [menuItemClick]
  )

  return (
    <SidebarNav toggle={toggleSidebar} open={open} left>
      <ul>
        {menuItems.map(({ node }, index) => (
          <li key={index} ref={setRef} className={index === selected ? 'active' : ''}>
            <a onClick={() => click(index)}>
              {node.frontmatter.title}
              <div style={{ position: 'absolute', right: '0px', top: '0px' }}>
                <ActiveIndicator died={node.frontmatter.died} hideText={true} />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SidebarNav>
  )
})

const Page = React.memo(({ data, location }) => {
  const [filteredPosts, setFilteredPosts] = useState(data.allVenues.edges)
  const [selected, setSelected] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [listRefs, setListRefs] = useState([])

  const [hideInactive, setHideInactive] = useState(false)
  const [hideActive, setHideActive] = useState(false)

  const initialViewState = {
    latitude: -45.8745557,
    longitude: 170.5016047,
    zoom: 13,
  } //the octagon

  const mapRef = React.useRef()

  const gigCount = useMemo(
    () =>
      data.gigCountByVenue['group'].reduce((obj, item) => {
        obj[item.fieldValue] = item.totalCount
        return obj
      }),
    [data],
    []
  )

  const markers = useMemo(() =>
    filteredPosts.map(({ node }, index) => (
      <Marker
        key={index}
        latitude={node.frontmatter.lat}
        longitude={node.frontmatter.lng}
        color={node.frontmatter.died == undefined ? '#367e80' : 'white'}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation()
          markerClick(index)
        }}
      >
        {node.frontmatter.died != undefined ? deadIcon : null}
      </Marker>
    ))
  )

  // Hide inactive venues when they toggle it
  useEffect(() => {
    const filteredPosts = data.allVenues.edges.filter(
      ({ node }) => (!hideActive && node.frontmatter.died === null) || (!hideInactive && node.frontmatter.died !== null)
    )
    setFilteredPosts(filteredPosts)
  }, [hideInactive, hideActive])

  // Set selected node when index changes
  useEffect(() => {
    selectedIndex !== null && setSelected(filteredPosts[selectedIndex].node)
  }, [selectedIndex])

  const listClick = useCallback(
    (index) => {
      setSelectedIndex(index)
      const selectedNode = filteredPosts[index].node
      mapRef.current.panTo({ lat: selectedNode.frontmatter.lat, lng: selectedNode.frontmatter.lng })
    },
    [mapRef]
  )

  const markerClick = useCallback(
    (index) => {
      setSelectedIndex(index)
      listRefs[index].scrollIntoView({ behavior: 'smooth' })
    },
    [listRefs]
  )

  const markerClose = useCallback(() => {
    setSelectedIndex(null)
    setSelected(null)
  })

  const searchFilter = useCallback(
    (searchInput) => {
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

  const setLRefs = useCallback(
    (ref) => {
      const newRefs = listRefs
      newRefs.push(ref)
      setListRefs(newRefs)
    },
    [listRefs]
  )

  return (
    <Layout
      location={location}
      hideBrandOnMobile={true}
      hideFooter={true}
      isSidebar={true}
      headerContent={<Search placeholder="Search venues" filter={searchFilter} />}
    >
      <Sidebar menuItems={filteredPosts} menuItemClick={listClick} setRef={setLRefs} selected={selectedIndex} />
      <HideFilters>
        <label>
          <input name="hideInactive" type="checkbox" checked={hideInactive} onChange={() => setHideInactive(!hideInactive)} />
          Hide dead
        </label>
        <label>
          <input name="hideActive" type="checkbox" checked={hideActive} onChange={() => setHideActive(!hideActive)} />
          Hide alive
        </label>
      </HideFilters>
      <FullMapWrapper>
        <Map
          ref={mapRef}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapboxAccessToken="pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          {markers}
          {selected !== null && (
            <Popup anchor="top" latitude={selected.frontmatter.lat} longitude={selected.frontmatter.lng} onClose={() => markerClose()}>
              <h3 style={{ marginBottom: '0' }}>{selected.frontmatter.title}</h3>
              <p style={{ marginTop: '0', marginBottom: '10px' }}>
                <ActiveIndicator died={selected.frontmatter.died} />
              </p>
              <HorizontalNav lineHeight="1" style={{ marginBottom: '10px' }}>
                {selected.frontmatter.facebook && (
                  <li>
                    <a href={selected.frontmatter.facebook}>Facebook</a>
                  </li>
                )}
                {selected.frontmatter.instagram && (
                  <li>
                    <a href={selected.frontmatter.instagram}>Instagram</a>
                  </li>
                )}
                {selected.frontmatter.spotify && (
                  <li>
                    <a href={selected.frontmatter.instagram}>Spotify</a>
                  </li>
                )}
                {selected.frontmatter.bandcamp && (
                  <li>
                    <a href={selected.frontmatter.bandcamp}>Bandcamp</a>
                  </li>
                )}
                {selected.frontmatter.soundcloud && (
                  <li>
                    <a href={selected.frontmatter.soundcloud}>Soundcloud</a>
                  </li>
                )}
                {selected.frontmatter.Website && (
                  <li>
                    <a href={selected.frontmatter.Website}>Website</a>
                  </li>
                )}
              </HorizontalNav>
              {selected.frontmatter.description && <p dangerouslySetInnerHTML={{ __html: selected.frontmatter.description }}></p>}
              <VenueGigsTile>
                <Link to={selected.fields.slug}>
                  {selected.frontmatter.cover && <GatsbyImage image={getImage(selected.frontmatter.cover)} alt="" />}
                  {!selected.frontmatter.cover && (
                    <div className="placeholder-image" style={{ backgroundImage: 'url(' + data.placeholder.publicURL + ')' }}></div>
                  )}
                  <span>View {gigCount[selected.fields.machine_name]} gigs at this venue</span>
                </Link>
              </VenueGigsTile>
            </Popup>
          )}
        </Map>
      </FullMapWrapper>
    </Layout>
  )
})

const FullMapWrapper = styled(MapWrapper)`
  height: ${(props) => `calc(100vh - ${props.theme.headerHeight} - 2px)`};
  z-index: 5;
`

const VenueGigsTile = styled.h4`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  border-radius: 5px;
  width: 230px;

  .placeholder-image {
    width: 100%;
    height: 200px;
  }

  span {
    position: absolute;
    bottom: 0px;
    left: 0px;
    color: ${(props) => props.theme.textColor};
    background: rgba(0, 0, 0, 0.7);
    padding: 5px;
    width: 100%;
  }

  a {
    &:hover,
    &:focus {
      span {
        color: ${(props) => lighten(0.5, props.theme.textColor)};
      }
    }

    &.active {
      color: ${(props) => lighten(0.5, props.theme.textColor)};
    }
  }
`

const HideFilters = styled.div`
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  position: fixed;
  right: ${rhythm(0.5)};
  top: ${(props) => props.theme.headerHeight};
  z-index: 6;
  label {
    margin: 5px;
    display: block;
  }
  input {
    margin-right: 5px;
  }
`

export const Head = (params) => {
  const title = `Venues | ${params.data.site.siteMetadata.title}`
  const description = params.data.site.siteMetadata.description

  return <SiteHead title={title} description={description} {...params} />
}

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allVenues: allMarkdownRemark(sort: { frontmatter: { title: ASC } }, filter: { fields: { type: { eq: "venues" } } }) {
      edges {
        node {
          ...VenueFrontmatter
        }
      }
    }
    gigCountByVenue: allMarkdownRemark(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "gigs" } } }) {
      group(field: { frontmatter: { venue: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    placeholder: file(name: { eq: "venue-placeholder-cat" }) {
      publicURL
    }
  }
`

export default Page
