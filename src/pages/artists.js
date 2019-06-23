import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import Search from '../components/Search'
import FlexGridContainer from '../components/FlexGridContainer'
import Shuffle from 'shufflejs'
import { theme } from '../utils/theme'
import { toMachineName, gridToSizes } from '../utils/helper'
import Tabs from '../components/Tabs'
import styled from '@emotion/styled'

const Pills = styled(Tabs)`
  position:fixed;
  width: auto;
  z-index: 4;
  top: auto !important;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0,0,0,.25);
  opacity: 0.6;
  transition: opacity 200ms ease-in-out;

  &:hover {
    opacity: 1;
  }

  button {
    border: none;
    border-radius: 10px;
  }
`

class Artists extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      filteredPosts: this.props.data.allArtists.edges,
      sortBy: "title"
    }

    this.gigCountsByArtist = this.props.data.gigsByArtist['group'].reduce((obj, item) => {
      if (obj[toMachineName(item.fieldValue)]) obj[toMachineName(item.fieldValue)] += item.totalCount
      else obj[toMachineName(item.fieldValue)] = item.totalCount
      return obj
    }, {})

    this.imagesByArtist = this.props.data.imagesByArtist['group'].reduce((obj, item) => {
      const name = item.fieldValue
      if (!obj[name]) obj[name] = {}
      obj[name] = item.edges
      return obj
    }, {})

    this.element = React.createRef()
  }

  componentDidMount() {
    // Shuffle is a nice library to make re-ordering look nicer
    this.shuffle = new Shuffle(this.element.current, {
      itemSelector: '.tile'
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.shuffle.resetItems()
    if (this.state.sortBy !== prevState.sortBy) {
      if (this.state.sortBy === "title") {
        this.sortByTitle()
      } else {
        this.sortByNumberOfGigs()
      }
    }
  }

  componentWillUnmount() {
    this.shuffle.destroy()
    this.shuffle = null
  }

  search = (searchInput) => {
    if (!searchInput || searchInput.length == 0) {
      this.shuffle.filter('all')
    } else {
      this.shuffle.filter((element) => {
        return element.getAttribute('title').toLowerCase().indexOf(searchInput) !== -1
      });
    }
  }

  sortByNumberOfGigs = () => {
    this.shuffle.sort({reverse: true, by: (element) => this.gigCountsByArtist[element.getAttribute("data-machinename")] || 0 })
  }

  sortByTitle = () => {
    this.shuffle.sort({by: (element) => element.getAttribute('title').toLowerCase()})
  }

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const grid = {
      xs: "6",
      sm: "4",
      md: "3",
      lg: "2"
    }

    return (
      <Layout
        location={this.props.location} description={siteDescription}
        title={`Artists | ${siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<Search placeholder="Search artists" toggleSidebar={this.toggleSidebar} filter={this.search}/>}
      >
        {!this.state.searching && <Pills>
          <small>
            <button className={this.state.sortBy === "title" ? "active" : ""} onClick={() => this.setState({sortBy: "title"})}>Title</button>
            <button className={this.state.sortBy === "numberOfGigs" ? "active" : ""} onClick={() => this.setState({sortBy: "numberOfGigs"})}>Gigs</button>
          </small>
        </Pills>}
        <FlexGridContainer fixedWidth ref={this.element} xs={grid.xs} sm={grid.sm} md={grid.md} lg={grid.lg}>
          {this.state.filteredPosts.map(({ node }) => {
            const title = (node.frontmatter.title || node.fields.slug) + (node.frontmatter.origin ? ` (${node.frontmatter.origin})` : "")
            const coverImage = node.frontmatter.cover ? node.frontmatter.cover : (this.imagesByArtist[node.fields.machine_name] && this.imagesByArtist[node.fields.machine_name][0].node)

            return (
              <Tile
                key={node.fields.slug}
                title={title}
                machineName={node.fields.machine_name}
                subtitle={`${this.gigCountsByArtist[node.fields.machine_name]} gigs`}
                image={coverImage}
                label={node.frontmatter.date}
                href={node.fields.slug}
                imageSizes={gridToSizes(grid, "400px")}
                height={this.state.filteredPosts.length == 1 ? "calc(100vh - " + theme.default.headerHeight + ")" : this.state.filteredPosts.length <= 8  ? "40vh" : "20vh"}
              />
            )
          })}
        </FlexGridContainer>
      </Layout>
    )
  }
}

export default Artists

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allArtists: allMarkdownRemark(sort: { fields: [frontmatter___title], order: ASC }, filter: {fields: {type: { eq: "artists"}}}) {
      edges {
        node {
          ...ArtistFrontmatter
        }
      }
    }
    imagesByArtist: allFile( filter: {extension: {eq: "jpg"}, fields: {type: { eq: "gigs"}} }) {
      group(field: fields___parentDir, limit: 1) {
        fieldValue
        edges {
          node {
            fields {
              parentDir
            }
            ...SmallImage
          }
        }
      }
    }
    gigsByArtist: allMarkdownRemark(filter: {fields: {type: { eq: "gigs"}}}) {
      group(field: frontmatter___artists___name) {
        fieldValue
        totalCount
      }
    }
  }
`
