import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import styled from "styled-components"
import { Map, Popup, TileLayer, Marker } from 'react-leaflet'
import SidebarNav from '../components/SidebarNav'
import Search from '../components/Search';
import MenuButton from '../components/MenuButton';
import { MdMenu } from 'react-icons/md';

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 5;
`
class Venues extends React.Component {

  constructor(props) {
    super(props)

    this.sidebarRef = React.createRef();
    this.listRefs = [];

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
    this.sidebarRef.current.scrollTo(0, this.listRefs[index].offsetTop);
    this.setState({selected: index})
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  filter = (e) => {
    const searchInput = e.target.value;
    if (!searchInput || searchInput == "") {
      const filteredPosts =  this.props.data.allVenues.edges;
      this.setState({filteredPosts})
    } else {
      const filteredPosts = this.props.data.allVenues.edges.filter(({node}) => {
        const titleResult = node.frontmatter.title.toLowerCase().includes(searchInput)
        return titleResult
      })
      this.setState({filteredPosts})
    }
  }

  setRef = (ref) => {
    this.listRefs.push(ref);
  };

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description

    return (
      <Layout
        description={siteDescription}
        location={this.props.location}
        title={`Venues | ${siteTitle}`}
        hideBrand={true}
        hideFooter={true}
        headerContent={<><MenuButton hideMobile={true} onClick={this.toggleSidebar}><MdMenu/></MenuButton><Search toggleSidebar={this.toggleSidebar} filter={this.filter}/></>}
      >
        <SidebarNav ref={this.sidebarRef} width="15vw" open={this.state.sidebarOpen} left>
          {
            this.state.filteredPosts.map(({ node }, index) =>
                <li ref={this.setRef} className={index === this.state.selected ? "active" : ""} key={index}>
                  <a onClick={() => this.select(index, [node.frontmatter.lat, node.frontmatter.lng])}>
                    {node.frontmatter.title}
                  </a>
                </li>
              )
          }
        </SidebarNav>
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
                    <Link to={node.fields.slug}>
                    {node.frontmatter.cover && <Img fluid={node.frontmatter.cover.childImageSharp.fluid}/>}
                    View gigs
                    </Link>
                    {node.frontmatter.facebook && <Link to={node.frontmatter.facebook}>Facebook</Link>}
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
      siteMetadata {
        title
        description
      }
    }
    allVenues: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "venues"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
            machine_name
          }
          frontmatter {
            lat
            lng
            title
            cover {
              childImageSharp {
                fluid(maxWidth: 400) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
