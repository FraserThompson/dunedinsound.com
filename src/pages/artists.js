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
import LoadingSpinner from '../components/LoadingSpinner'

const Page = React.memo(({ data, location }) => {
  const [filteredPosts, setFilteredPosts] = useState(null)

  const [sortBy, setSortBy] = useState('title')
  const [shuffle, setShuffle] = useState(null)

  const element = useRef()

  const grid = {
    xs: '6',
    sm: '4',
    md: '3',
    lg: '2',
  }

  const gigMetadataByArtist = useMemo(
    () =>
      data.gigsByArtist['group'].reduce((obj, item) => {
        const machineName = toMachineName(item.fieldValue)
        const date = new Date(item['edges'][0]['node'].frontmatter.date).getTime()

        if (!obj[machineName]) {
          obj[machineName] = { totalCount: item.totalCount || 0, lastGig: date }
        } else {
          obj[machineName].totalCount += item.totalCount
        }

        if (date > obj[machineName].lastGig) {
          obj[machineName].lastGig = date
        }

        return obj
      }, {}),
    []
  )

  const imagesByArtist = useMemo(
    () =>
      data.imagesByArtist['group'].reduce((obj, item) => {
        const name = item.fieldValue
        if (!obj[name]) obj[name] = {}
        obj[name] = item.edges
        return obj
      }, {}),
    []
  )

  useEffect(() => {
    setFilteredPosts(data.allArtists.edges)
  }, [])

  useEffect(() => {
    setShuffle(new Shuffle(element.current, { itemSelector: '.tile' }))
  }, [filteredPosts])

  useEffect(() => {
    shuffle && shuffle.update()
    return () => shuffle && shuffle.destroy()
  }, [shuffle])

  useEffect(() => {
    if (sortBy === 'title') {
      sortByTitle()
    } else if (sortBy === 'numberOfGigs') {
      sortByNumberOfGigs()
    } else if (sortBy === 'lastGig') {
      sortByLastGig()
    }
  }, [sortBy])

  const sortByNumberOfGigs = useCallback(() => {
    shuffle && shuffle.sort({ reverse: true, by: (element) => gigMetadataByArtist[element.getAttribute('data-machinename')]['totalCount'] })
  }, [shuffle])

  const sortByTitle = useCallback(() => {
    shuffle && shuffle.sort({ by: (element) => element.getAttribute('data-title').toLowerCase() })
  }, [shuffle])

  const sortByLastGig = useCallback(() => {
    shuffle && shuffle.sort({ reverse: true, by: (element) => element.getAttribute('data-lastgig') })
  }, [shuffle])

  const search = useCallback(
    (searchInput) => {
      if (!shuffle) return
      if (!searchInput || searchInput.length == 0) {
        shuffle.filter('all')
      } else {
        shuffle.filter((element) => {
          return element.getAttribute('data-title').toLowerCase().indexOf(searchInput) !== -1
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
      {!filteredPosts && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
      {filteredPosts && (
        <Pills>
          <button className={sortBy === 'title' ? 'active' : ''} onClick={() => setSortBy('title')}>
            Title
          </button>
          <button className={sortBy === 'lastGig' ? 'active' : ''} onClick={() => setSortBy('lastGig')}>
            Last Played
          </button>
          <button className={sortBy === 'numberOfGigs' ? 'active' : ''} onClick={() => setSortBy('numberOfGigs')}>
            Most Gigs
          </button>
        </Pills>
      )}
      <ArtistGrid fixedWidth ref={element} xs={grid.xs} sm={grid.sm} md={grid.md} lg={grid.lg}>
        {filteredPosts &&
          filteredPosts.map(({ node }) => {
            const metadata = gigMetadataByArtist[node.fields.machine_name]

            if (!metadata) {
              console.error('Fatal: Metadata missing for ' + node.fields.machine_name)
            }

            const title = (node.frontmatter.title || node.fields.slug) + (node.frontmatter.origin ? ` (${node.frontmatter.origin})` : '')
            const coverImage = node.frontmatter.cover
              ? node.frontmatter.cover
              : imagesByArtist[node.fields.machine_name] && imagesByArtist[node.fields.machine_name][0].node

            return (
              <Tile
                key={node.fields.slug}
                title={title}
                machineName={node.fields.machine_name}
                subtitle={`${metadata ? metadata.totalCount : 0} gigs`}
                image={coverImage}
                label={node.frontmatter.date}
                to={node.fields.slug}
                height={filteredPosts.length == 1 ? 'calc(100vh - ' + theme.default.headerHeight + ')' : filteredPosts.length <= 8 ? '40vh' : '20vh'}
                lastGig={metadata ? metadata.lastGig : 0}
              />
            )
          })}
      </ArtistGrid>
    </Layout>
  )
})

const ArtistGrid = styled(FlexGridContainer)`
  position: relative;
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Pills = styled(Tabs)`
  color: ${(props) => props.theme.foregroundColor};
  position: fixed;
  width: auto;
  z-index: 4;
  top: auto !important;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  opacity: 0.6;
  transition: opacity 200ms ease-in-out;

  font-size: 80%;

  &:hover {
    opacity: 1;
  }

  button {
    border: none;
    border-radius: 10px;
    height: 100%;
    &.active {
      color: black;
      background-color: ${(props) => props.theme.foregroundColor};
    }
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
    gigsByArtist: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: { fields: { type: { eq: "gigs" } } }) {
      group(field: frontmatter___artists___name) {
        fieldValue
        totalCount
        edges {
          node {
            frontmatter {
              date
            }
          }
        }
      }
    }
  }
`

export default Page
