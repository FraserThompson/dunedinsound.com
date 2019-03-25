import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import GridContainer from '../components/GridContainer';
import Tile from '../components/Tile';

class Venues extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allVenues.edges

    const artistTiles = posts.map(({ node }) => {
      const title = node.frontmatter.title || node.fields.slug

      return (
        <Tile
          key={node.fields.slug}
          title={title}
          href={node.fields.slug}
          height={"40vh"}
        />
      )
    });

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <GridContainer xs="6" sm="4" md="3" lg="2">
          {artistTiles}
        </GridContainer>
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
  }
`
