import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import GridContainer from '../components/GridContainer'
import GigTile from '../components/GigTile'
import { theme } from '../utils/theme'

const Page = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const siteDescription = data.site.siteMetadata.description
  const posts = data.allMarkdownRemark.edges
  const firstGig = posts.find(({ node }) => node.fields.type === 'gigs').node

  const postSections = posts.reduce(
    (obj, { node }) => {
      let tile = undefined
      if (node.fields.type === 'gigs' && node.fields.machine_name != firstGig.fields.machine_name) {
        tile = <GigTile title={node.frontmatter.title} node={node} height="33vh" key={node.fields.slug} />
      } else if (node.fields.type === 'blog') {
        tile = (
          <Tile
            key={node.fields.slug}
            title={`${node.frontmatter.tags.includes('interview') ? 'INTERVIEW: ' : 'ARTICLE: '}${node.frontmatter.title}`}
            image={node.frontmatter.cover}
            label={node.frontmatter.date}
            height={'33vh'}
            to={node.fields.slug}
          />
        )
      } else if (node.fields.type === 'vaultsessions') {
        tile = (
          <Tile
            key={node.fields.slug}
            image={node.frontmatter.cover}
            height={'33vh'}
            title={`VAULT SESSION: ${node.frontmatter.title}`}
            to={node.fields.slug}
          />
        )
      }

      if (tile && obj.firstTwo.length < 2) {
        obj.firstTwo.push(tile)
      } else if (tile && obj.nextThree.length < 9) {
        obj.nextThree.push(tile)
      }

      return obj
    },
    { firstTwo: [], nextThree: [] }
  )

  return (
    <Layout description={siteDescription} location={location} title={siteTitle}>
      <HomePageGridContainer>
        <div className="featured-gig">
          <GigTile title={firstGig.frontmatter.title} node={firstGig} feature={true} height="66vh" />
        </div>
        <div className="two-side-gigs">{postSections.firstTwo.map(tile => tile)}</div>
        <div className="everything-else">
          <GridContainer>{postSections.nextThree.map(tile => tile)}</GridContainer>
          <GridContainer xs={6} sm={6} md={6} lg={6}>
            <Tile height={'10vh'} to={'/gigs/'} backgroundColor={theme.default.foregroundColor}>
              More Gigs
            </Tile>
            <Tile height={'10vh'} to={'/blog/'} backgroundColor={theme.default.secondaryColor}>
              More Articles
            </Tile>
          </GridContainer>
        </div>
      </HomePageGridContainer>
    </Layout>
  )
}

const HomePageGridContainer = styled(GridContainer)`
  .featured-gig {
    grid-column: span 12;
  }
  .two-side-gigs {
    grid-column: span 12;
  }
  .everything-else {
    grid-column: span 12;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    .featured-gig {
      grid-column: span 8;
    }
    .two-side-gigs {
      grid-column: span 4;
    }
    .everything-else {
      grid-column: span 12;
    }
  }
`

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    vaultSessionLogo: file(name: { eq: "vslogo" }) {
      publicURL
    }
    allMarkdownRemark(limit: 16, sort: { fields: [frontmatter___date], order: DESC }, filter: { fields: { type: { regex: "/gigs|blog|vaultsessions$/" } } }) {
      edges {
        node {
          excerpt
          ...GigTileFrontmatter
          frontmatter {
            tags
          }
        }
      }
    }
  }
`

export default Page;
