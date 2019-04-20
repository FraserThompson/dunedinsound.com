import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import Search from '../components/Search'
import FlexGridContainer from '../components/FlexGridContainer'
import Shuffle from 'shufflejs'
import { theme } from '../utils/theme'
import { shuffleFilterDebounced } from '../utils/helper'

class Artists extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      filteredPosts: this.props.data.allArtists.edges,
      sidebarOpen: true
    }

    this.gigCountsByArtist = this.props.data.gigsByArtist['group'].reduce((obj, item) => {
      obj[item.fieldValue] = item.totalCount
      return obj
    })

    this.element = React.createRef();
  }

  componentDidMount() {
    // Shuffle is a nice library to make re-ordering look nicer
    this.shuffle = new Shuffle(this.element.current, {
      itemSelector: '.tile'
    });
  }

  componentDidUpdate() {
    this.shuffle.resetItems();
  }

  componentWillUnmount() {
    this.shuffle.destroy();
    this.shuffle = null;
  }

  filter = async (e) => {
    const searchInput = e.target.value.toLowerCase()
    if (!searchInput || searchInput.trim() == "") {
      this.shuffle.filter('all')
    } else {
      await shuffleFilterDebounced(searchInput, this.shuffle)
    }
  }

  toggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description

    const imagesByArtist = data.imagesByArtist['group'].reduce((obj, item) => {
      const name = item.fieldValue
      if (!obj[name]) obj[name] = {}
      obj[name] = item.edges
      return obj
    }, {});

    const artistTiles = this.state.filteredPosts.map(({ node }) => {
      const title = node.frontmatter.title || node.fields.slug
      const coverImage = node.frontmatter.cover ? node.frontmatter.cover.childImageSharp.fluid : (imagesByArtist[node.fields.machine_name] && imagesByArtist[node.fields.machine_name][0].node.childImageSharp.fluid)

      return (
        <Tile
          key={node.fields.slug}
          title={title}
          subtitle={`${this.gigCountsByArtist[title]} gigs`}
          image={coverImage}
          label={node.frontmatter.date}
          href={node.fields.slug}
          height={this.state.filteredPosts.length == 1 ? "calc(100vh - " + theme.default.headerHeight + ")" : this.state.filteredPosts.length <= 8  ? "40vh" : "20vh"}
        />
      )
    });

    return (
      <Layout
        location={this.props.location} description={siteDescription}
        title={`Artists | ${siteTitle}`}
        hideBrandOnMobile={true}
        hideFooter={true}
        headerContent={<Search placeholder="Search artists" toggleSidebar={this.toggleSidebar} filter={this.filter} />}>
        <FlexGridContainer fixedWidth ref={this.element} xs="6" sm="4" md="3" lg="2">
          {artistTiles}
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
    allArtists: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "artists"}}}) {
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
            ...MediumImage
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
