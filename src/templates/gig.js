import React, { useCallback, useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import { toMachineName, graphqlGroupToObject } from '../utils/helper'
import Banner from '../components/Banner'
import { scale } from '../utils/typography'
import Tile from '../components/Tile'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from 'react-icons/md'
import HorizontalNav from '../components/HorizontalNav'
import ZoopUpWrapper from '../components/ZoopUpWrapper'
import PlayerContainer from '../components/PlayerContainer'
import GigArtistMedia from '../components/GigArtistMedia'
import GigContext from './GigContext'
import LoadingSpinner from '../components/LoadingSpinner'

const BannerContent = React.memo(({ data }) => (
  <>
    <ZoopUpWrapper title="BACK TO GIGS ☝" href="/gigs/">
      <p>☝ BACK TO GIGS ☝</p>
      <MdKeyboardArrowUp />
    </ZoopUpWrapper>
    {data.prevPost && (
      <NextPrevWrapper className="hideMobile" prev>
        <div className="icon">
          <MdKeyboardArrowRight />
        </div>
        <Tile
          key={data.prevPost.fields.slug}
          title={data.prevPost.frontmatter.title}
          image={data.prevPost.frontmatter.cover}
          label={data.prevPost.frontmatter.date}
          height="100%"
          imageSizes={{ xs: '1', sm: '4', lg: '4' }}
          to={data.prevPost.fields.slug}
        />
      </NextPrevWrapper>
    )}
    {data.nextPost && (
      <NextPrevWrapper className="hideMobile" next>
        <div className="icon">
          <MdKeyboardArrowLeft />
        </div>
        <Tile
          key={data.nextPost.fields.slug}
          title={data.nextPost.frontmatter.title}
          image={data.nextPost.frontmatter.cover}
          label={data.nextPost.frontmatter.date}
          height="100%"
          imageSizes={{ xs: '1', sm: '4', lg: '4' }}
          to={data.nextPost.fields.slug}
        />
      </NextPrevWrapper>
    )}
  </>
))

export default React.memo(({ data, location }) => {
  const [artistMedia, setArtistMedia] = useState([])
  const [artistAudio, setArtistAudio] = useState([])
  const [cover, setCover] = useState(data.thisPost.frontmatter.cover)

  useEffect(() => {
    if (typeof window !== `undefined` && window.location.hash) {
      scrollTo(null, window.location.hash.substring(1))
    }

    // Key-value object of images by artist
    const imagesByArtist = data.images && graphqlGroupToObject(data.images.group, true)

    // Cover image is either one image or all the images in the _header folder
    imagesByArtist['_header'] && setCover(imagesByArtist['_header'])

    // Key-value object of audio files by artist
    const audioByArtist =
      data.audio &&
      data.audio['group'].reduce((obj, item) => {
        const machineName = item.fieldValue
        const grouped_audio = item.edges.reduce((obj, item) => {
          const name = item.node.name.replace('.mp3', '') // because old audio file JSON has mp3 in the name
          if (!obj[name]) obj[name] = {}
          obj[name][item.node.ext] = item.node
          return obj
        }, {})

        obj[machineName] = Object.keys(grouped_audio).map(item => grouped_audio[item])
        return obj
      }, {})

    // Key-value object of details by artist
    const detailsByArtist = data.artists && graphqlGroupToObject(data.artists.group)

    const combinedMedia = data.thisPost.frontmatter.artists.map(artist => {
      const machineName = toMachineName(artist.name)
      return {
        ...artist,
        machineName,
        title: detailsByArtist && detailsByArtist[machineName] ? detailsByArtist[machineName][0].node.frontmatter.title : artist.name,
        details: detailsByArtist && detailsByArtist[machineName] && detailsByArtist[machineName][0].node,
        images: imagesByArtist && imagesByArtist[machineName],
        audio: audioByArtist && audioByArtist[machineName],
      }
    })

    setArtistAudio(combinedMedia.filter(thing => thing.audio))
    setArtistMedia(combinedMedia)
  }, [])

  const scrollTo = useCallback((e, anchor) => {
    e && e.preventDefault()
    e && e.stopPropagation()
    const element = document.getElementById(anchor)
    element && element.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const gigTitle = data.thisPost.frontmatter.title
  const venueDetails = data.venue && data.venue.edges.length > 0 && data.venue.edges[0].node

  return (
    <Layout
      location={location}
      description={`Photos, audio and video from ${gigTitle}.`}
      image={cover && cover.src}
      title={`${gigTitle} | ${data.site.siteMetadata.title}`}
      date={data.thisPost.frontmatter.date}
      type="article"
      scrollHeaderContent={
        <a onClick={e => scrollTo(e, 'top')} href="#top" title="Scroll to top">
          <h1 className="big">{gigTitle}</h1>
        </a>
      }
    >
      <Banner id="top" title={gigTitle} backgroundImage={cover} customContent={<BannerContent data={data} />}>
        <HorizontalNav>
          <p>
            {data.thisPost.frontmatter.date}{' '}
            {venueDetails && (
              <>
                at <Link to={venueDetails.fields.slug}>{venueDetails.frontmatter.title}</Link>
              </>
            )}
          </p>
          {data.thisPost.frontmatter.description && <p dangerouslySetInnerHTML={{ __html: data.thisPost.frontmatter.description }}></p>}
          {artistMedia.length == 0 && <LoadingSpinner />}
          {artistMedia.map((artist, index) => {
            return (
              <li key={index}>
                <a className="button" onClick={e => scrollTo(e, artist.machineName)} href={'#' + artist.machineName}>
                  {artist.title}
                </a>
              </li>
            )
          })}
        </HorizontalNav>
      </Banner>
      <GigContext.Provider value={{ artistMedia, artistAudio, gigTitle }}>
        <GigArtistMedia />
        <PlayerContainer />
      </GigContext.Provider>
    </Layout>
  )
})

export const pageQuery = graphql`
  query GigsBySlug($slug: String!, $prevSlug: String, $nextSlug: String, $artists: [String]!, $venue: String!, $parentDir: String!) {
    site {
      ...SiteInformation
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      ...GigFrontmatter
    }
    nextPost: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      ...GigTileFrontmatter
    }
    prevPost: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      ...GigTileFrontmatter
    }
    images: allFile(filter: { extension: { in: ["jpg", "JPG"] }, name: { ne: "cover.jpg" }, fields: { gigDir: { eq: $parentDir }, type: { eq: "gigs" } } }) {
      group(field: fields___parentDir) {
        fieldValue
        edges {
          node {
            name
            publicURL
            ...MediumImage
          }
        }
      }
    }
    audio: allFile(filter: { extension: { in: ["mp3", "json"] }, fields: { gigDir: { eq: $parentDir }, type: { eq: "gigs" } } }) {
      group(field: fields___parentDir) {
        fieldValue
        edges {
          node {
            name
            publicURL
            ext
          }
        }
      }
    }
    artists: allMarkdownRemark(filter: { fields: { machine_name: { in: $artists }, type: { eq: "artists" } } }) {
      group(field: fields___machine_name) {
        fieldValue
        edges {
          node {
            fields {
              machine_name
              slug
            }
            frontmatter {
              title
              bandcamp
              facebook
              soundcloud
              origin
              website
            }
          }
        }
      }
    }
    venue: allMarkdownRemark(filter: { fields: { machine_name: { eq: $venue }, type: { eq: "venues" } } }) {
      edges {
        node {
          fields {
            machine_name
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`

const NextPrevWrapper = styled.div`
  color: ${props => props.theme.textColor};
  position: absolute;
  right: ${props => (props.prev ? '-10vw' : null)};
  left: ${props => (props.next ? '-10vw' : null)};
  z-index: 5;
  height: 100%;
  top: 0px;
  width: 20vw;
  opacity: 0.5;
  transition: all 300ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    ${scale(4)};
    position: absolute;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    right: ${props => (props.prev ? '10vw' : null)};
    left: ${props => (props.next ? '10vw' : null)};
    height: 100%;
  }
  .tile {
    position: absolute;
    width: 100%;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
  &:hover {
    right: ${props => (props.prev ? '0px' : null)};
    left: ${props => (props.next ? '0px' : null)};
    box-shadow: ${props => (props.prev ? '-6px 0px 12px rgba(0,0,0,.5)' : '6px 0px 12px rgba(0,0,0,.5)')};
    opacity: 1;
    .tile {
      opacity: 1;
    }
  }
`
