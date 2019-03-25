import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import GridContainer from '../components/GridContainer';
import Tile from '../components/Tile';

class Gigs extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <GridContainer>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          const artists = node.frontmatter.artists.map(artist => artist.name).join(", ")
          return (
            <Tile
              key={node.fields.slug}
              title={title}
              subtitle={artists}
              image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
              label={node.frontmatter.date}
              height="20vh"
              href={node.fields.slug}>
            </Tile>
          )
        })}
        </GridContainer>
      </Layout>
    )
  }
}

export default Gigs

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { eq: "gigs"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM YYYY")
            title
            artists { name }
            cover {
              childImageSharp {
                fluid(maxWidth: 1600) {
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
