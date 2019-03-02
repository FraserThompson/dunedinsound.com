import React from 'react'
import { StaticQuery, Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Layout from '../components/Layout'
import { rhythm } from '../utils/typography'
import Tile from '../components/Tile';
import GridContainer from '../components/GridContainer';
import { theme } from '../utils/theme';

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

        <GridContainer>
          {posts.map(({ node }, index) => {
            const title = node.frontmatter.title || node.fields.slug
            const tile =
              <Tile
                title={title}
                image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                label={node.frontmatter.date}
                height={"calc(100vh - " + theme.default.headerHeight + ")"}
                href={node.fields.slug}>
              </Tile>
              return <div key={node.fields.slug} style={{gridColumn: index === 0 ? "span 6" : "span 2"}}>
                {tile}
              </div>
            })
          }
        </GridContainer>
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
    allMarkdownRemark(limit: 4, sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { regex: "/gigs|blog$/"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            artists { name }
            venue
            cover {
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
  }
`
