import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { graphqlGroupToObject } from '../utils/helper'
import styled from '@emotion/styled'
import 'mapbox-gl/dist/mapbox-gl.css'
import Search from '../components/Search'
import HorizontalNav from '../components/HorizontalNav'
import { lighten } from 'polished'
import ActiveIndicator from '../components/ActiveIndicator'
import { rhythm } from '../utils/typography'
import { deadIcon } from '../templates/venue/MapMarkers'
import { MapWrapper } from '../components/MapWrapper'
import { SiteHead } from '../components/SiteHead'
import Map, { Marker, Popup } from 'react-map-gl'
import { VenuesSidebar } from '../components/page/VenuesSidebar'

const Page = React.memo(({ data, location }) => {
  const [filteredPosts, setFilteredPosts] = useState(data.allVenues.nodes)
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

  const covers = useMemo(() => graphqlGroupToObject(data.covers.group))

  const markers = useMemo(
    () =>
      filteredPosts.map((node, index) => {
        return (
          <Marker
            key={node.title}
            latitude={node.lat}
            longitude={node.lng}
            color={node.died == null ? '#367e80' : 'white'}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              markerClick(index)
            }}
          >
            {node.died !== null ? deadIcon : null}
          </Marker>
        )
      }),
    [filteredPosts]
  )

  // Hide inactive venues when they toggle it
  useEffect(() => {
    const filteredPosts = data.allVenues.nodes.filter((node) => (!hideActive && node.died === null) || (!hideInactive && node.died !== null))
    setFilteredPosts(filteredPosts)
  }, [hideInactive, hideActive])

  // Set selected node when index changes
  useEffect(() => {
    selectedIndex !== null && setSelected(filteredPosts[selectedIndex])
  }, [selectedIndex])

  const listClick = useCallback(
    (index) => {
      setSelectedIndex(index)
      const selectedNode = filteredPosts[index]
      mapRef.current.panTo({ lat: selectedNode.lat, lng: selectedNode.lng })
    },
    [mapRef, filteredPosts]
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
        const filteredPosts = data.allVenues.nodes
        setFilteredPosts(filteredPosts)
      } else {
        const filteredPosts = data.allVenues.nodes.filter((node) => node.title.toLowerCase().includes(searchInput))
        setFilteredPosts(filteredPosts)
      }
    },
    [data.allVenues.nodes]
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
      <VenuesSidebar menuItems={filteredPosts} menuItemClick={listClick} setRef={setLRefs} selected={selectedIndex} />
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
            <Popup anchor="bottom" offset={[0, -40]} latitude={selected.lat} longitude={selected.lng} onClose={() => markerClose()}>
              <h3 style={{ marginBottom: '0' }}>{selected.title}</h3>
              <p style={{ marginTop: '0', marginBottom: '10px' }}>
                <ActiveIndicator died={selected.died} born={selected.date} />
              </p>
              <HorizontalNav lineHeight="1" style={{ marginBottom: '10px' }}>
                {selected.facebook && (
                  <li>
                    <a href={selected.facebook}>Facebook</a>
                  </li>
                )}
                {selected.instagram && (
                  <li>
                    <a href={selected.instagram}>Instagram</a>
                  </li>
                )}
                {selected.spotify && (
                  <li>
                    <a href={selected.instagram}>Spotify</a>
                  </li>
                )}
                {selected.bandcamp && (
                  <li>
                    <a href={selected.bandcamp}>Bandcamp</a>
                  </li>
                )}
                {selected.soundcloud && (
                  <li>
                    <a href={selected.soundcloud}>Soundcloud</a>
                  </li>
                )}
                {selected.Website && (
                  <li>
                    <a href={selected.Website}>Website</a>
                  </li>
                )}
              </HorizontalNav>
              {selected.description && <p dangerouslySetInnerHTML={{ __html: selected.description }}></p>}
              <VenueGigsTile>
                <Link to={selected.fields.slug}>
                  {covers[selected.fields.fileName] ? (
                    <GatsbyImage image={getImage(covers[selected.fields.fileName][0].childImageSharp)} alt="" />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  <span>View {gigCount[selected.fields.fileName]} gigs at this venue</span>
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
    background-color: black;
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

export const Head = (params) => <SiteHead title={'Venues'} {...params} />

export const pageQuery = graphql`
  query {
    allVenues: allVenueYaml(sort: { title: ASC }) {
      nodes {
        ...VenueFrontmatter
      }
    }
    covers: allFile(filter: { sourceInstanceName: { eq: "media" }, fields: { mediaDir: { eq: "venue" } }, name: { eq: "cover" } }) {
      group(field: { fields: { parentDir: SELECT } }) {
        fieldValue
        nodes {
          ...SmallImage
        }
      }
    }
    gigCountByVenue: allGigYaml(sort: { date: DESC }) {
      group(field: { venue: SELECT }) {
        fieldValue
        totalCount
      }
    }
  }
`

export default Page
