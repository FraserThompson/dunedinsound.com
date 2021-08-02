import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import styled from '@emotion/styled'
import { MapContainer, Popup, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import marker from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import SidebarNav from '../components/SidebarNav'
import Search from '../components/Search'
import HorizontalNav from '../components/HorizontalNav'
import { lighten } from 'polished'
import ActiveIndicator from '../components/ActiveIndicator'
import { rhythm } from '../utils/typography'

// Weird hack to fix leaflet.css importing relative images
if (typeof L !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
  })
}

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
  const gigCount = useMemo(
    () =>
      data.gigCountByVenue['group'].reduce((obj, item) => {
        obj[item.fieldValue] = item.totalCount
        return obj
      }),
    [data],
    []
  )

  const initialMapCenter = [-45.8745557, 170.5016047] //the octagon
  const initialZoom = 13

  const [filteredPosts, setFilteredPosts] = useState(data.allVenues.edges)
  const [selected, setSelected] = useState(null)
  const [listRefs, setListRefs] = useState([])
  const [markerRefs, setMarkerRefs] = useState([])

  const [hideInactive, setHideInactive] = useState(false)

  const [map, setMap] = useState(null)

  // Hide inactive venues when they toggle it
  useEffect(() => {
    const filteredPosts = data.allVenues.edges.filter(({ node }) => !hideInactive || node.frontmatter.died === null)
    setFilteredPosts(filteredPosts)
  }, [hideInactive])

  const select = useCallback(
    (index) => {
      setSelected(index)
      map.setView(markerRefs[index].getLatLng(), 18)
      markerRefs[index].openPopup()
    },
    [map, markerRefs]
  )

  const markerClick = useCallback(
    (index) => {
      listRefs[index].scrollIntoView({ behavior: 'smooth' })
      setSelected(index)
    },
    [listRefs]
  )

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

  const setMRefs = useCallback(
    (ref) => {
      const newRefs = markerRefs
      newRefs.push(ref)
      setMarkerRefs(newRefs)
    },
    [markerRefs]
  )

  return (
    <Layout
      description={data.site.siteMetadata.description}
      location={location}
      title={`Venues | ${data.site.siteMetadata.title}`}
      hideBrandOnMobile={true}
      hideFooter={true}
      isSidebar={true}
      headerContent={<Search placeholder="Search venues" filter={searchFilter} />}
    >
      <Sidebar menuItems={filteredPosts} menuItemClick={select} setRef={setLRefs} selected={selected} />
      <HideInactive>
        <label>
          <input name="hideInactive" type="checkbox" checked={hideInactive} onChange={() => setHideInactive(!hideInactive)} />
          Hide defunct
        </label>
      </HideInactive>
      <MapWrapper>
        <MapContainer style={{ height: '100%', width: '100%' }} center={initialMapCenter} zoom={initialZoom} whenCreated={setMap}>
          <TileLayer
            url="https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ"
            attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
          />
          {filteredPosts.map(({ node }, index) => (
            <Marker ref={setMRefs} key={index} position={[node.frontmatter.lat, node.frontmatter.lng]} eventHandlers={{ click: () => markerClick(index) }}>
              <Popup>
                <h3 style={{ marginBottom: '0' }}>{node.frontmatter.title}</h3>
                <p style={{ marginTop: '0', marginBottom: '10px' }}>
                  <ActiveIndicator died={node.frontmatter.died} />
                </p>
                <HorizontalNav lineHeight="1">
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
                {node.frontmatter.description && <p style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: node.frontmatter.description }}></p>}
                <VenueGigsTile>
                  <Link to={node.fields.slug}>
                    {node.frontmatter.cover && <GatsbyImage image={getImage(node.frontmatter.cover)} alt="" />}
                    {!node.frontmatter.cover && (
                      <div className="placeholder-image" style={{ backgroundImage: 'url(' + data.placeholder.publicURL + ')' }}></div>
                    )}
                    <span>View {gigCount[node.fields.machine_name]} gigs at this venue</span>
                  </Link>
                </VenueGigsTile>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapWrapper>
    </Layout>
  )
})

const MapWrapper = styled.div`
  width: 100%;
  height: ${(props) => `calc(100vh - ${props.theme.headerHeight} - 2px)`};
  position: relative;
  z-index: 5;

  .leaflet-popup-content {
    max-width: 230px;
  }
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

const HideInactive = styled.div`
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  position: fixed;
  right: ${rhythm(0.5)};
  top: ${(props) => props.theme.headerHeight};
  z-index: 6;
  input {
    margin-right: 5px;
  }
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
    placeholder: file(name: { eq: "venue-placeholder-cat" }) {
      publicURL
    }
  }
`

export default Page
