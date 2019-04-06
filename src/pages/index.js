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
    const firstNode = posts[0].node

    return (
      <Layout description={siteDescription} location={this.props.location} title={siteTitle}>
        <GridContainer>
          <div style={{gridColumn:  "span 8"}}>
            <Tile
              title={firstNode.frontmatter.title}
              subtitle={firstNode.frontmatter.artists.map(artist => artist.name).join(", ")}
              image={firstNode.frontmatter.cover && firstNode.frontmatter.cover.childImageSharp.fluid}
              label={firstNode.frontmatter.date}
              height={"calc(90vh)"}
              href={firstNode.fields.slug}>
            </Tile>
          </div>
          <div style={{gridColumn: "span 4"}}>
            {posts.map(({ node }, index) => {
              if (index === 0) return
              const title = node.frontmatter.title || node.fields.slug
              const height = "calc(30vh)"
              const artists = node.frontmatter.artists.map(artist => artist.name)
              const tile =
                <Tile
                  title={title}
                  subtitle={artists.join(", ")}
                  image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                  label={node.frontmatter.date}
                  height={height}
                  href={node.fields.slug}>
                </Tile>
                return <div key={node.fields.slug}>{tile}</div>
              })
            }
          </div>
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
            date(formatString: "DD MMMM YYYY")
            title
            artists { name }
            venue
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
