import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import Search from '../components/Search'
import FlexGridContainer from '../components/FlexGridContainer'
import Shuffle from 'shufflejs'
import { theme } from '../utils/theme'
import { toMachineName } from '../utils/helper'
import Tabs from '../components/Tabs'
import styled from '@emotion/styled'

export default React.memo(({ data, location }) => {
  const filteredPosts = data.allArtists.edges

  const [sortBy, setSortBy] = useState('title')
  const [shuffle, setShuffle] = useState(null)

  const element = useRef()

  const grid = {
    xs: '6',
    sm: '4',
    md: '3',
    lg: '2',
  }

  const gigCountsByArtist = useMemo(() =>
    data.gigsByArtist['group'].reduce((obj, item) => {
      if (obj[toMachineName(item.fieldValue)]) obj[toMachineName(item.fieldValue)] += item.totalCount
      else obj[toMachineName(item.fieldValue)] = item.totalCount
      return obj
    }, {})
  )

  const imagesByArtist = useMemo(() =>
    data.imagesByArtist['group'].reduce((obj, item) => {
      const name = item.fieldValue
      if (!obj[name]) obj[name] = {}
      obj[name] = item.edges
      return obj
    }, {})
  )

  useEffect(() => {
    setShuffle(new Shuffle(element.current, { itemSelector: '.tile' }))
    return () => shuffle && shuffle.destroy()
  }, [])

  useEffect(() => {
    if (sortBy === 'title') {
      sortByTitle()
    } else {
      sortByNumberOfGigs()
    }
  }, [sortBy])

  const sortByNumberOfGigs = useCallback(() => {
    shuffle && shuffle.sort({ reverse: true, by: element => gigCountsByArtist[element.getAttribute('data-machinename')] || 0 })
  }, [shuffle])

  const sortByTitle = useCallback(() => {
    shuffle && shuffle.sort({ by: element => element.getAttribute('data-title').toLowerCase() })
  }, [shuffle])

  const search = useCallback(
    searchInput => {
      if (!shuffle) return
      if (!searchInput || searchInput.length == 0) {
        shuffle.filter('all')
      } else {
        shuffle.filter(element => {
          return (
            element
              .getAttribute('data-title')
              .toLowerCase()
              .indexOf(searchInput) !== -1
          )
        })
      }
    },
    [shuffle]
  )

  return (
    <Layout
      location={location}
      description={data.site.siteMetadata.description}
      title={`Artists | ${data.site.siteMetadata.title}`}
      hideBrandOnMobile={true}
      hideFooter={true}
      headerContent={<Search placeholder="Search artists" filter={search} />}
    >
      <Pills>
        <small>
          <button className={sortBy === 'title' ? 'active' : ''} onClick={() => setSortBy('title')}>
            Title
          </button>
          <button className={sortBy === 'numberOfGigs' ? 'active' : ''} onClick={() => setSortBy('numberOfGigs')}>
            Gigs
          </button>
        </small>
      </Pills>
      <FlexGridContainer fixedWidth ref={element} xs={grid.xs} sm={grid.sm} md={grid.md} lg={grid.lg}>
        {filteredPosts.map(({ node }) => {
          const title = (node.frontmatter.title || node.fields.slug) + (node.frontmatter.origin ? ` (${node.frontmatter.origin})` : '')
          const coverImage = node.frontmatter.cover
            ? node.frontmatter.cover
            : imagesByArtist[node.fields.machine_name] && imagesByArtist[node.fields.machine_name][0].node

          return (
            <Tile
              key={node.fields.slug}
              title={title}
              machineName={node.fields.machine_name}
              subtitle={`${gigCountsByArtist[node.fields.machine_name]} gigs`}
              image={coverImage}
              label={node.frontmatter.date}
              to={node.fields.slug}
              imageSizes={grid}
              height={filteredPosts.length == 1 ? 'calc(100vh - ' + theme.default.headerHeight + ')' : filteredPosts.length <= 8 ? '40vh' : '20vh'}
            />
          )
        })}
      </FlexGridContainer>
    </Layout>
  )
})

const Pills = styled(Tabs)`
  position: fixed;
  width: auto;
  z-index: 4;
  top: auto !important;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  opacity: 0.6;
  transition: opacity 200ms ease-in-out;

  &:hover {
    opacity: 1;
  }

  button {
    border: none;
    border-radius: 10px;
  }
`

export const pageQuery = graphql`
  query {
    site {
      ...SiteInformation
    }
    allArtists: allMarkdownRemark(sort: { fields: [frontmatter___title], order: ASC }, filter: { fields: { type: { eq: "artists" } } }) {
      edges {
        node {
          ...ArtistFrontmatter
        }
      }
    }
    imagesByArtist: allFile(filter: { extension: { eq: "jpg" }, fields: { type: { eq: "gigs" } } }) {
      group(field: fields___parentDir, limit: 1) {
        fieldValue
        edges {
          node {
            fields {
              parentDir
            }
            ...SmallImage
          }
        }
      }
    }
    gigsByArtist: allMarkdownRemark(filter: { fields: { type: { eq: "gigs" } } }) {
      group(field: frontmatter___artists___name) {
        fieldValue
        totalCount
      }
    }
  }
`
