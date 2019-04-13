import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'
import Tile from '../components/Tile';
import {nodeTypeToHuman} from '../utils/helper';
import GridContainer from '../components/GridContainer';

const HomePageGridContainer = styled(GridContainer)`
  div:nth-child(1) {
    grid-column: span 12;
  }
  div:nth-child(2) {
    grid-column: span 12;
  }
  div:nth-child(3) {
    grid-column: span 12;
  }
  div:nth-child(4) {
    display: initial;
  }
  @media screen and (min-width: 768px) {
    div:nth-child(1) {
      grid-column: span 8;
    }
    div:nth-child(2) {
      grid-column: span 4;
    }
    div:nth-child(3) {
      grid-column: span 12;
    }
    div:nth-child(4) {
      display: none;
    }
  }
`

class Homepage extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    const firstNode = posts[0].node

    return (
      <Layout description={siteDescription} location={this.props.location} title={siteTitle}>
        <HomePageGridContainer>
          <div>
            <Tile
              title={"LATEST GIG: " + firstNode.frontmatter.title}
              subtitle={firstNode.frontmatter.artists && firstNode.frontmatter.artists.map(artist => artist.name).join(", ")}
              image={firstNode.frontmatter.cover && firstNode.frontmatter.cover.childImageSharp.fluid}
              label={firstNode.frontmatter.date}
              height={"calc(90vh)"}
              href={firstNode.fields.slug}
            />
          </div>
          <div>
            {posts.slice(1, 4).map(({ node }, index) => {
              const title = nodeTypeToHuman(node.fields.type).toUpperCase() + ": " + node.frontmatter.title || node.fields.slug
              const artists = node.frontmatter.artists && node.frontmatter.artists.map(artist => artist.name).join(", ")
              const tile =
                <Tile
                  title={title}
                  subtitle={artists}
                  image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                  label={node.frontmatter.date}
                  height={"30vh"}
                  href={node.fields.slug}
                />
                return <div key={node.fields.slug}>{tile}</div>
              })
            }
          </div>
          <div>
            <GridContainer>
              {posts.slice(3, 7).map(({ node }, index) => {
                if (index === 0) return
                const title = nodeTypeToHuman(node.fields.type).toUpperCase() + ": " + node.frontmatter.title || node.fields.slug
                const artists = node.frontmatter.artists && node.frontmatter.artists.map(artist => artist.name).join(", ")
                const tile =
                  <Tile
                    title={title}
                    subtitle={artists}
                    image={node.frontmatter.cover && node.frontmatter.cover.childImageSharp.fluid}
                    label={node.frontmatter.date}
                    height={"30vh"}
                    href={node.fields.slug}
                  />
                  return <div key={node.fields.slug}>{tile}</div>
                })
              }
              <Tile
                title="More gigs"
                height={"10vh"}
                href="/gigs"
              />
           </GridContainer>
          </div>
        </HomePageGridContainer>
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
    allMarkdownRemark(limit: 7, sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { regex: "/gigs|blog$/"}}}) {
      edges {
        node {
          excerpt
          fields {
            slug
            type
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
