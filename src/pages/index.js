import React from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import GridContainer from '../components/GridContainer'
import GigTile from '../components/GigTile'
import { theme } from '../utils/theme'
import { SiteHead } from '../components/SiteHead'

const Page = ({ data, location }) => {
  const gigs = data.gigs.nodes
  const blogs = data.blogs.nodes

  // Combine gigs and blogs then sort them by date
  const posts = [...gigs, ...blogs]
  const sortedPosts = posts.sort((a, b) => {
    const a_date = a.date ?? a.frontmatter.date
    const b_date = b.date ?? b.frontmatter.date
    return new Date(a_date) > new Date(b_date) ? -1 : 1
  })

  // Sorts the posts into chunks for easy display
  const postSections = sortedPosts.reduce(
    (obj, node) => {
      let tile = undefined

      if (node.fields.type === 'gig') {
        tile = (
          <GigTile
            title={node.title}
            node={node}
            height={obj.feature == null ? '66vh' : '33vh'}
            feature={obj.feature == null ? true : false}
            key={node.fields.slug}
          />
        )
      } else if (node.fields.type === 'blog') {
        tile = (
          <Tile
            key={node.fields.slug}
            prefix={node.frontmatter.tags.includes('Interview') ? 'INTERVIEW ' : 'ARTICLE '}
            title={node.frontmatter.title}
            subtitle={node.frontmatter.description}
            image={node.frontmatter.cover}
            label={node.frontmatter.date}
            height={'33vh'}
            to={node.fields.slug}
          />
        )
      }

      if (!tile) return obj

      if (obj.feature == null && node.fields.type === 'gig') {
        obj.feature = tile
      } else if (obj.firstTwo.length < 2) {
        obj.firstTwo.push(tile)
      } else if (obj.theRest.length < 9) {
        obj.theRest.push(tile)
      }

      return obj
    },
    { feature: null, firstTwo: [], theRest: [] }
  )

  return (
    <Layout location={location}>
      <HomePageGridContainer>
        <div className="featured-gig">{postSections.feature}</div>
        <div className="two-side-gigs">{postSections.firstTwo.map((tile) => tile)}</div>
        <div className="everything-else">
          <GridContainer>{postSections.theRest.map((tile) => tile)}</GridContainer>
          <GridContainer xs={6} sm={6} md={6} lg={6}>
            <Tile height={'10vh'} to={'/gigs/'} backgroundColor={theme.default.foregroundColor} textColor="black" fontWeight="bold">
              More Gigs
            </Tile>
            <Tile height={'10vh'} to={'/blog/'} backgroundColor={theme.default.secondaryColor} fontWeight="bold">
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
  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
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

export const Head = (params) => <SiteHead {...params} />

export const pageQuery = graphql`
  query {
    blogs: allMdx(limit: 12, sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } } }) {
      nodes {
        ...BlogFrontmatter
      }
    }
    gigs: allGigYaml(limit: 12, sort: { date: DESC }) {
      nodes {
        ...GigTileFrontmatter
      }
    }
  }
`

export default Page
