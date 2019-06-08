import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import styled from '@emotion/styled'
import { Map, Popup, TileLayer, Marker } from 'react-leaflet'
import SidebarNav from '../components/SidebarNav'
import Search from '../components/Search'
import HorizontalNav from '../components/HorizontalNav';
import MenuButton from '../components/MenuButton';
import { MdMenu } from 'react-icons/md';

//const filterDebounced = AwesomeDebouncePromise((needle, haystack) => haystack.filter(({node}) => node.frontmatter.title.toLowerCase().includes(needle)), 500);

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 5;
`
class Venues extends React.Component {

  constructor(props) {
    super(props)

    this.listRefs = [];

    this.imageCountByGig = this.props.data.gigCountByVenue['group'].reduce((obj, item) => {
      obj[item.fieldValue] = item.totalCount
      return obj
    })

    this.state = {
      filteredPosts: this.props.data.allVenues.edges,
      sidebarOpen: true,
      selected: null,
      zoomLevel: 13,
      center: [-45.8745557, 170.5016047] // the octagon
    }
  }

  openPopup = (marker, index) => {
    if (marker && marker.leafletElement && index === this.state.selected) {
      marker.leafletElement.openPopup()
    }
  }

  select = (index, center) => {
    this.setState({selected: index, zoomLevel: 18, center, sidebarOpen: true})
  }

  markerClick = (index) => {
    this.listRefs[index].scrollIntoView({behavior: "smooth"})
    this.setState({selected: index})
  }

  filter = async (searchInput) => {
    if (!searchInput || searchInput.length == 0) {
      const filteredPosts = this.props.data.allVenues.edges
      this.setState({filteredPosts})
    } else {
      const filteredPosts = this.props.data.allVenues.edges.filter(({node}) => node.frontmatter.title.toLowerCase().includes(searchInput))
      this.setState({filteredPosts})
    }
  }

  setRef = (ref) => {
    this.listRefs.push(ref);
  };

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description

    return (
      <Layout
        description={siteDescription}
        location={this.props.location}
        title={`Venues | ${siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<>
            <SidebarNav toggle={this.toggleSidebar} width="100vw" button={<MenuButton hideMobile={true} onClick={this.toggleSidebar}><MdMenu/></MenuButton>} open={this.state.sidebarOpen} left>
              <ul>
                {
                  this.state.filteredPosts.map(({ node }, index) =>
                    <li key={index} ref={this.setRef} className={index === this.state.selected ? "active" : ""}>
                      <a onClick={() => this.select(index, [node.frontmatter.lat, node.frontmatter.lng])}>
                        {node.frontmatter.title}
                      </a>
                    </li>
                  )
                }
              </ul>
            </SidebarNav>
            <Search placeholder="Search venues" filter={this.filter}/>
          </>
        }
      >
        <MapWrapper>
          {
            typeof window !== 'undefined' && <Map style={{height: "100%", width: "100%"}} center={this.state.center} zoom={this.state.zoomLevel}>
              <TileLayer
                url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ'
                attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
              />
            {this.state.filteredPosts.map(({ node }, index) =>
              <Marker ref={(marker) => this.openPopup(marker, index)} key={index} position={[node.frontmatter.lat, node.frontmatter.lng]}>
                <Popup onOpen={() => this.markerClick(index)}>
                    <h3>{node.frontmatter.title}</h3>
                    {node.frontmatter.description && <p dangerouslySetInnerHTML={{__html : node.frontmatter.description}}></p>}
                    <h4>
                      <Link to={node.fields.slug}>
                        {node.frontmatter.cover && <Img fluid={node.frontmatter.cover.childImageSharp.fluid}/>}
                        View {this.imageCountByGig[node.fields.machine_name]} gigs at this venue
                      </Link>
                    </h4>
                    <HorizontalNav>
                      {node.frontmatter.facebook && <li><a href={node.frontmatter.facebook}>Facebook</a></li>}
                      {node.frontmatter.bandcamp && <li><a href={node.frontmatter.bandcamp}>Bandcamp</a></li>}
                      {node.frontmatter.soundcloud && <li><a href={node.frontmatter.soundcloud}>Soundcloud</a></li>}
                      {node.frontmatter.Website && <li><a href={node.frontmatter.Website}>Website</a></li>}
                    </HorizontalNav>
                </Popup>
              </Marker>
            )}
            </Map>
          }
        </MapWrapper>
      </Layout>
    )
  }
}

export default Venues

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allVenues: allMarkdownRemark(sort: { fields: [frontmatter___title], order: ASC }, filter: {fields: {type: { eq: "venues"}}}) {
      edges {
        node {
          ...VenueFrontmatter
        }
      }
    }
    gigCountByVenue: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}}) {
      group(field: frontmatter___venue) {
        fieldValue
        totalCount
      }
    }
  }
`
