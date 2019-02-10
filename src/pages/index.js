import React from 'react'
import { StaticQuery, Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Layout from '../components/Layout'
import { rhythm } from '../utils/typography'
import Tile from '../components/Tile';

class Homepage extends React.Component {
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
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <Tile
              key={node.fields.slug}
              title={title}
              subtitle={node.frontmatter.subtitle}
              image={node.fields.cover.childImageSharp.fluid}
              label={node.frontmatter.date}
              href={node.fields.slug}>
            </Tile>
            )}
          )
        }
      </Layout>
    )
  }
}

export default Homepage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { regex: "/gigs|blog$/"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
            cover {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            artists { name }
            subtitle
            venue
          }
        }
      }
    }
  }
`
