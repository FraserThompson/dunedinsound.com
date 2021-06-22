import React, { useState, useCallback, useMemo } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import styled from '@emotion/styled'
import { Map, Popup, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import marker from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import SidebarNav from '../components/SidebarNav'
import Search from '../components/Search'
import HorizontalNav from '../components/HorizontalNav'
import { lighten } from 'polished'

// Weird hack to fix leaflet.css importing relative images
if (typeof L !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
  })
}

export const ActiveIndicator = React.memo(({died, hideText = false}) => (
  !died ? <ActiveIcon title="Active">⬤ {!hideText && "Active"}</ActiveIcon> : <DefunctIcon title="Defunct">⬤ {!hideText && `Defunct since ${died}`}</DefunctIcon>
));

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
            <a onClick={() => click(index, [node.frontmatter.lat, node.frontmatter.lng])}>
              {node.frontmatter.title}
              <div style={{position: "absolute", right: "0px", top: "0px"}}>
                <ActiveIndicator died={node.frontmatter.died} hideText={true}/>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SidebarNav>
  )
})

export default React.memo(({ data, location }) => {
  const imageCountByGig = useMemo(
    () =>
      data.gigCountByVenue['group'].reduce((obj, item) => {
        obj[item.fieldValue] = item.totalCount
        return obj
      }),
    [data],
    []
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
                  <h3 style={{marginBottom: "0"}}>{node.frontmatter.title}</h3>
                  <p style={{marginTop: "0", marginBottom: "10px"}}><ActiveIndicator died={node.frontmatter.died}/></p>
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
                  {node.frontmatter.description && <p style={{marginTop: "10px"}} dangerouslySetInnerHTML={{ __html: node.frontmatter.description }}></p>}
                  <VenueGigsTile>
                    <Link to={node.fields.slug}>
                      {node.frontmatter.cover && <Img fluid={node.frontmatter.cover.childImageSharp.fluid} />}
                      {!node.frontmatter.cover &&
                      <div className="placeholder-image" style={{backgroundImage: "url(" + data.placeholder.publicURL + ")"}}></div>
                      }
                      <span>
                        View {imageCountByGig[node.fields.machine_name]} gigs at this venue
                      </span>
                    </Link>
                  </VenueGigsTile>
                </Popup>
              </Marker>
            ))}
          </Map>
        )}
      </MapWrapper>
    </Layout>
  )
})

const MapWrapper = styled.div`
  width: 100%;
  height: ${props => `calc(100vh - ${props.theme.headerHeight} - 2px)`};
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

  .placeholder-image {
    width: 250px;
    height: 200px;
  }

  span {
    position: absolute;
    bottom: 0px;
    color: ${props => props.theme.textColor};
    background: rgba(0,0,0,0.7);
    padding: 5px;
    width: 100%;
  }

  a {
    &:hover,
    &:focus {
      span {
        color: ${props => lighten(0.5, props.theme.textColor)};
      }
    }

    &.active {
      color: ${props => lighten(0.5, props.theme.textColor)};
    }
  }
`

const ActiveIcon = styled.span`
  color: #31a24c;
  font-weight: 600;
`;

const DefunctIcon = styled.span`
  color: #ab0000;
  font-weight: 600;
`;


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
