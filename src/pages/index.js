import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import Tile from '../components/Tile';
import { nodeTypeToHuman } from '../utils/helper';
import GridContainer from '../components/GridContainer';
import GigTile from '../components/GigTile';

const HomePageGridContainer = styled(GridContainer)`
  > div:nth-of-type(1) {
    grid-column: span 12;
  }
  > div:nth-of-type(2) {
    grid-column: span 12;
  }
  > div:nth-of-type(3) {
    grid-column: span 12;
  }
  > div:nth-of-type(4) {
    display: initial;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    > div:nth-of-type(1) {
      grid-column: span 8;
    }
    > div:nth-of-type(2) {
      grid-column: span 4;
    }
    > div:nth-of-type(3) {
      grid-column: span 12;
    }
    > div:nth-of-type(4) {
      display: none;
    }
  }
`

export default ({data, location}) => {

    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    const firstGig = posts.find(({node}) => node.fields.type === "gigs").node

    const postSections = posts.reduce((obj, { node }) => {
      const title = nodeTypeToHuman(node.fields.type).toUpperCase() + ": " + node.frontmatter.title || node.fields.slug

      let tile = undefined;
      if (node.fields.type === "gigs" && node.fields.machine_name != firstGig.fields.machine_name) {
        tile = <GigTile title={node.frontmatter.title} node={node} height="30vh" key={node.fields.slug} imageSizes={{xs: 12, md: 4, lg: 4}}/>
      } else if (node.fields.type === "blog") {
        tile = <Tile
          key={node.fields.slug}
          title={title}
          subtitle={node.excerpt}
          image={node.frontmatter.cover}
          label={node.frontmatter.date}
          height={"30vh"}
          imageSizes={{xs: 12, md: 4, lg: 4}}
          href={node.fields.slug}
        />
      } else if (node.fields.type === "vaultsessions") {
        tile = <Tile
          key={node.fields.slug}
          image={node.frontmatter.cover}
          height={"30vh"}
          title={title}
          imageSizes={{xs: 12, md: 4, lg: 4}}
          href={node.fields.slug}
        />
      }

      if (tile && obj.firstTwo.length < 2) {
        obj.firstTwo.push(tile)
      } else if (tile && obj.nextThree.length < 3) {
        obj.nextThree.push(tile);
      }

      return obj;
  }, {firstTwo: [], nextThree: []})

  return (
    <Layout description={siteDescription} location={location} title={siteTitle}>
      <HomePageGridContainer>
        <div>
          <GigTile imageSizes={{xs: 12, md: 8, lg: 8}} title={firstGig.frontmatter.title} node={firstGig} height="60vh"/>
        </div>
        <div>
          {postSections.firstTwo.map(tile => tile)}
        </div>
        <GridContainer>
          {postSections.nextThree.map(tile => tile)}
        </GridContainer>
      </HomePageGridContainer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    vaultSessionLogo: file(name: { eq: "vslogo" }) {
      publicURL
    }
    allMarkdownRemark(limit: 10, sort: { fields: [frontmatter___date], order: DESC }, filter: {fields: {type: { regex: "/gigs|blog|vaultsessions$/"}}}) {
      edges {
        node {
          excerpt
          ...GigTileFrontmatter
        }
      }
    }
  }
`
