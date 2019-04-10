import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import GridContainer from '../components/GridContainer';
import Tile from '../components/Tile';
import Search from '../components/Search';

class Artists extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filteredPosts: this.props.data.allArtists.edges,
      sidebarOpen: true
    }
  }

  filter = (e) => {
    const searchInput = e.target.value;
    if (!searchInput || searchInput == "") {
      const filteredPosts =  this.props.data.allArtists.edges;
      this.setState({filteredPosts})
    } else {
      const filteredPosts = this.props.data.allArtists.edges.filter(({node}) =>node.frontmatter.title.toLowerCase().includes(searchInput))
      this.setState({filteredPosts})
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
          image={coverImage}
          label={node.frontmatter.date}
          href={node.fields.slug}
          height={"20vh"}
        />
      )
    });

    return (
      <Layout
        location={this.props.location} description={siteDescription}
        title={`Artists | ${siteTitle}`}
        hideBrand={true}
        hideFooter={true}
        headerContent={<Search toggleSidebar={this.toggleSidebar} filter={this.filter} />}>
        <GridContainer xs="6" sm="4" md="3" lg="2">
          {artistTiles}
        </GridContainer>
      </Layout>
    )
  }
}

export default Artists

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allArtists: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "artists"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
            machine_name
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
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
    imagesByArtist: allFile( filter: {extension: {eq: "jpg"}}) {
      group(field: fields___artist) {
        fieldValue
        edges {
          node {
            fields {
              artist
            }
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
