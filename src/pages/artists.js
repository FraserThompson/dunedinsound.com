import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import Search from '../components/Search'
import FlexGridContainer from '../components/FlexGridContainer'
import Shuffle from 'shufflejs'
import { theme } from '../utils/theme'
import { toMachineName } from '../utils/helper'
import styled from '@emotion/styled'
import LoadingSpinner from '../components/LoadingSpinner'
import { rhythm } from '../utils/typography'
import { SiteHead } from '../components/SiteHead'

const Page = React.memo(({ data, location }) => {
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('title')
  const [hideInactive, setHideInactive] = useState(false)
  const [countryFilter, setCountryFilter] = useState(null)
  const [artistOrigins, setArtistOrigins] = useState(null)
  const [searchInput, setSearchInput] = useState(null)
  const [shuffle, setShuffle] = useState(null)
  const [artistList, setArtistList] = useState([])

  const element = useRef()
  const animationRef = useRef()

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
        const date = new Date(item['nodes'][0].date).getTime()

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
        obj[name] = item.nodes
        return obj
      }, {}),
    []
  )

  // Used below to improve immediate load performance
  const animate = (time) => {
    setArtistList(data.allArtists.nodes)
    animationRef.current = requestAnimationFrame(animate)
  }

  // To improve immediate page load performance:
  // - start with a blank list
  // - wait until the page has rendered
  // - set the list so it renders the elements
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  // Make a shuffle board and set the artist origin dropdown
  useEffect(() => {
    const newShuffle = new Shuffle(element.current, { itemSelector: '.tile' })
    newShuffle.on(Shuffle.EventType.LAYOUT, () => setLoading(false))
    setShuffle(newShuffle)

    const origins = artistList.reduce((acc, node) => {
      const origin = node.origin || 'Dunedin'
      if (!acc[origin]) acc[origin] = 0
      acc[origin]++
      return acc
    }, [])

    setArtistOrigins(origins)
  }, [artistList])

  // Update the shuffle when it changes and delete it when it goes
  useEffect(() => {
    shuffle && shuffle.update()
    return () => shuffle && shuffle.destroy()
  }, [shuffle])

  // Sorting toggle
  useEffect(() => {
    setLoading(true)
    if (sortBy === 'title') {
      sortByTitle()
    } else if (sortBy === 'numberOfGigs') {
      sortByNumberOfGigs()
    } else if (sortBy === 'lastGig') {
      sortByLastGig()
    }
  }, [sortBy])

  // Filters
  useEffect(() => {
    if (!shuffle) return
    setLoading(true)
    shuffle.filter((el) => getShuffleFilter(el))
  }, [countryFilter, hideInactive, searchInput])

  const getShuffleFilter = useCallback(
    (el) => {
      return (
        (!hideInactive || el.getAttribute('data-active') == 'true') &&
        (!countryFilter || el.getAttribute('data-origin') === countryFilter) &&
        (!searchInput || searchInput.length == 0 || el.getAttribute('data-title').toLowerCase().indexOf(searchInput) !== -1)
      )
    },
    [countryFilter, hideInactive, searchInput]
  )

  const sortByNumberOfGigs = useCallback(() => {
    if (!shuffle) return
    shuffle.sort({
      reverse: true,
      by: (el) => (gigMetadataByArtist[el.getAttribute('data-machinename')] ? gigMetadataByArtist[el.getAttribute('data-machinename')]['totalCount'] : 0),
    })
  }, [shuffle])

  const sortByTitle = useCallback(() => {
    if (!shuffle) return
    shuffle.sort({ by: (el) => el.getAttribute('data-title').toLowerCase() })
  }, [shuffle])

  const sortByLastGig = useCallback(() => {
    if (!shuffle) return
    shuffle.sort({ reverse: true, by: (el) => el.getAttribute('data-lastgig') })
  }, [shuffle])

  return (
    <Layout location={location} hideBrandOnMobile={true} headerContent={<Search placeholder="Search artists" filter={(search) => setSearchInput(search)} />}>
      {loading && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
      <Filters>
        <span>Sort by: </span>
        <div>
          <button className={sortBy === 'title' ? 'active' : ''} onClick={() => setSortBy('title')}>
            Title
          </button>
          <button className={sortBy === 'lastGig' ? 'active' : ''} onClick={() => setSortBy('lastGig')}>
            Last Played
          </button>
          <button className={sortBy === 'numberOfGigs' ? 'active' : ''} onClick={() => setSortBy('numberOfGigs')}>
            Most Gigs
          </button>
        </div>
        <HideInactive>
          <label>
            <input name="hideInactive" type="checkbox" checked={hideInactive} onChange={() => setHideInactive(!hideInactive)} />
            Hide inactive
          </label>
        </HideInactive>
        <select name="countries" onChange={(e) => setCountryFilter(e.target.value !== 'all' ? e.target.value : null)}>
          <option value={'all'}>All origins ({artistList.length})</option>
          {artistOrigins &&
            Object.keys(artistOrigins).map((country) => (
              <option key={country} value={country}>
                {country} ({artistOrigins[country]})
              </option>
            ))}
        </select>
      </Filters>
      <ArtistGrid fixedWidth ref={element} xs={grid.xs} sm={grid.sm} md={grid.md} lg={grid.lg}>
        {artistList.map((node) => {
          const metadata = gigMetadataByArtist[node.fields.fileName]

          if (!metadata) {
            console.error('Fatal: Metadata missing for ' + node.fields.fileName)
          }

          const title = (node.title || node.fields.slug) + (node.origin ? ` (${node.origin})` : '')
          const coverImage = imagesByArtist[node.fields.fileName] && imagesByArtist[node.fields.fileName][0]

          return (
            <Tile
              key={node.fields.slug}
              title={title}
              subtitle={`${metadata ? metadata.totalCount : 0} gigs`}
              image={coverImage}
              label={node.date}
              to={node.fields.slug}
              height={artistList.length == 1 ? 'calc(100vh - ' + theme.default.headerHeight + ')' : artistList.length <= 8 ? '40vh' : '15vh'}
              dataAttributes={{
                'data-title': title,
                'data-machinename': node.fields.fileName,
                'data-lastgig': metadata ? metadata.lastGig : 0,
                'data-active': node.died === null,
                'data-origin': node.origin || 'Dunedin',
              }}
            />
          )
        })}
      </ArtistGrid>
    </Layout>
  )
})

export const Head = (params) => <SiteHead title={'Artist'} {...params} />

const ArtistGrid = styled(FlexGridContainer)`
  position: relative;
  overflow: hidden;
  top: 76px;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    top: 30px;
  }
`

const LoadingWrapper = styled.div`
  width: 100vw;
  min-height: ${(props) => `calc(100vh - ${props.theme.headerHeight} - 1px)`};
  position: fixed;
  top: ${(props) => `calc(${props.theme.headerHeight})`};
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Filters = styled.div`
  position: fixed;
  top: ${(props) => props.theme.headerHeightMobile};
  z-index: 2;
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  display: flex;
  align-items: center;

  color: black;
  border-bottom: 1px solid black;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);

  font-size: 80%;
  width: 100%;
  min-height: 30px;

  background-color: ${(props) => props.theme.contrastColor};

  > div,
  span {
    margin-right: ${rhythm(0.5)};
  }

  button {
    border: none;
    background-color: black;
    &.active,
    &:active {
      color: black;
      background-color: ${(props) => props.theme.foregroundColor};
    }
  }
  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    position: fixed;
    top: ${(props) => props.theme.headerHeight};
  }
`

const HideInactive = styled.span`
  input {
    margin-right: 5px;
  }
`

export const pageQuery = graphql`
  query {
    allArtists: allArtistYaml(sort: { title: ASC }) {
      nodes {
        ...ArtistFrontmatter
      }
    }
    imagesByArtist: allFile(filter: { sourceInstanceName: { eq: "media" }, extension: { eq: "jpg" }, fields: { mediaDir: { eq: "gig" } } }) {
      group(field: { fields: { parentDir: SELECT } }, limit: 1) {
        fieldValue
        nodes {
          fields {
            parentDir
          }
          ...SmallImage
        }
      }
    }
    gigsByArtist: allGigYaml(sort: { date: DESC }) {
      group(field: { artists: { name: SELECT } }) {
        fieldValue
        totalCount
        nodes {
          date
        }
      }
    }
  }
`

export default Page
