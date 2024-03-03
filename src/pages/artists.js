import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import Search from '../components/Search'
import FlexGridContainer from '../components/FlexGridContainer'
import Shuffle from 'shufflejs'
import { toMachineName } from '../utils/helper'
import styled from '@emotion/styled'
import LoadingSpinner from '../components/LoadingSpinner'
import { SiteHead } from '../components/SiteHead'
import Subheader from '../components/Subheader'

const ArtistGridTile = React.memo(({ node, metadata, coverImage }) => {
  if (!metadata) {
    console.error('Fatal: Metadata missing for ' + node.fields.fileName)
  }

  const title = (node.title || node.fields.slug) + (node.origin ? ` (${node.origin})` : '')

  return (
    <Tile
      title={title}
      subtitle={`${metadata?.totalCount || 0} gigs`}
      image={coverImage}
      label={node.date}
      to={node.fields.slug}
      height={'15vh'}
      dataAttributes={{
        'data-title': title,
        'data-machinename': node.fields.fileName,
        'data-lastgig': metadata?.lastGig || 0,
        'data-active': node.died === null,
        'data-origin': node.origin || 'Dunedin',
      }}
    />
  )
})

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

  const grid = useMemo(
    () => ({
      xs: '6',
      sm: '4',
      md: '3',
      lg: '2',
    }),
    []
  )

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
  const animate = useCallback(() => {
    setArtistList(data.allArtists.nodes)
    animationRef.current = requestAnimationFrame(animate)
  }, [data])

  // To improve immediate page load performance:
  // - start with a blank list
  // - wait until the page has rendered
  // - set the list so it renders the elements
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [data])

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
    shuffle.filter((el) => getShuffleFilter(el))
  }, [countryFilter, hideInactive, searchInput])

  const getShuffleFilter = useCallback(
    (el) =>
      (!hideInactive || el.getAttribute('data-active') == 'true') &&
      (!countryFilter || el.getAttribute('data-origin') === countryFilter) &&
      (!searchInput || searchInput.length == 0 || el.getAttribute('data-title').toLowerCase().indexOf(searchInput) !== -1),
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

  // Click callbacks since it has better immediate reponse than using effects
  const sortByCallback = useCallback((what) => {
    setLoading(true)
    setSortBy(what)
  })
  const hideInactiveCallback = useCallback((what) => {
    setLoading(true)
    setHideInactive(what)
  })
  const searchCallback = useCallback((what) => {
    setLoading(true)
    setSearchInput(what)
  })
  const countryFilterCallback = useCallback((what) => {
    setLoading(true)
    setCountryFilter(what)
  })

  return (
    <Layout location={location} hideBrandOnMobile={true} headerContent={<Search placeholder="Search artists" filter={(search) => searchCallback(search)} />}>
      {loading && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
      <Subheader>
        <span>Sort by: </span>
        <div>
          <button className={sortBy === 'title' ? 'active' : ''} onMouseDown={() => sortByCallback('title')}>
            Title
          </button>
          <button className={sortBy === 'lastGig' ? 'active' : ''} onMouseDown={() => sortByCallback('lastGig')}>
            Last Played
          </button>
          <button className={sortBy === 'numberOfGigs' ? 'active' : ''} onMouseDown={() => sortByCallback('numberOfGigs')}>
            Most Gigs
          </button>
        </div>
        <HideInactive>
          <label>
            <input name="hideInactive" type="checkbox" checked={hideInactive} onChange={() => hideInactiveCallback(!hideInactive)} />
            Hide inactive
          </label>
        </HideInactive>
        <select name="countries" onChange={(e) => countryFilterCallback(e.target.value !== 'all' ? e.target.value : null)}>
          <option value={'all'}>All origins ({artistList.length})</option>
          {artistOrigins &&
            Object.keys(artistOrigins).map((country) => (
              <option key={country} value={country}>
                {country} ({artistOrigins[country]})
              </option>
            ))}
        </select>
      </Subheader>
      <ArtistGrid fixedWidth ref={element} xs={grid.xs} sm={grid.sm} md={grid.md} lg={grid.lg}>
        {artistList.map((node) => (
          <ArtistGridTile
            key={node.fields.slug}
            node={node}
            metadata={gigMetadataByArtist[node.fields.fileName]}
            coverImage={imagesByArtist[node.fields.fileName] && imagesByArtist[node.fields.fileName][0]}
          />
        ))}
      </ArtistGrid>
    </Layout>
  )
})

export const Head = (params) => <SiteHead title={'Artist'} {...params} />

const ArtistGrid = styled(FlexGridContainer)`
  position: relative;
  overflow: hidden;
  top: 76px;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    top: ${(props) => props.theme.subheaderHeight};
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
