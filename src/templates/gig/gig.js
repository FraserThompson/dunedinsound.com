import React, { useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../../components/Layout'
import { toMachineName, graphqlGroupToObject, scrollTo } from '../../utils/helper'
import Banner from '../../components/Banner'
import HorizontalNav from '../../components/HorizontalNav'
import PlayerContainer from '../../components/PlayerContainer'
import GigArtistMedia from './ArtistMedia'
import YouTubeResponsive from '../../components/YouTubeResponsive'
import LoadingSpinner from '../../components/LoadingSpinner'
import BannerContent from './BannerContent'
import styled from '@emotion/styled'
import { rhythm } from '../../utils/typography'
import BackButton from '../../components/BackButton'
import BackToTop from '../../components/BackToTop'
import { getImage } from 'gatsby-plugin-image'

const Page = React.memo(({ data }) => {
  const [artistMedia, setArtistMedia] = useState([])
  const [artistAudio, setArtistAudio] = useState([])
  const [cover, setCover] = useState(data.thisPost.frontmatter.cover)
  const location = typeof window !== `undefined` && window.location
  const history = typeof window !== `undefined` && window.history

  useEffect(() => {
    if (location.hash) {
      scrollTo(null, location.hash.substring(1))
    } else if (typeof window !== `undefined` && window.previousPath && window.previousPath !== location.href) {
      // We need to scroll to top manually because we disabled Gatsby's default behavior (see gatsby-browser.js) so our
      // lightbox back button feature works.
      window.scrollTo(0, 0)
    }

    // Key-value object of images by artist
    const imagesByArtist = data.images && graphqlGroupToObject(data.images.group, true, (fieldValue) => fieldValue.split('/')[1])

    // Cover image is either one image or all the images in the _header folder
    imagesByArtist['_header'] && setCover(imagesByArtist['_header'])

    // Key-value object of audio files by artist
    const audioByArtist =
      data.audio &&
      data.audio['group'].reduce((obj, item) => {
        const machineName = item.fieldValue.split('/')[1]
        const grouped_audio = item.edges.reduce((obj, item) => {
          // There appears to be a bug in the GraphQL extension filter which sometimes allows images to slip
          // through... So instead of pursuing that we'll just add this check here.
          if (item.node.ext !== '.json' && item.node.ext !== '.mp3') return obj

          const name = item.node.name.replace('.mp3', '') // because old audio file JSON has mp3 in the name

          if (!obj[name]) obj[name] = {}
          obj[name][item.node.ext] = item.node
          return obj
        }, {})

        obj[machineName] = Object.keys(grouped_audio).map((item) => grouped_audio[item])
        return obj
      }, {})

    // Key-value object of details by artist
    const detailsByArtist = data.artists && graphqlGroupToObject(data.artists.group)

    const combinedMedia = data.thisPost.frontmatter.artists.map((artist) => {
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

    // Set the audio and image blobs to be consumed and displayed later
    setArtistAudio(combinedMedia.filter((thing) => thing.audio && thing.audio.length > 0))
    setArtistMedia(combinedMedia)
  }, [])

  const gigTitle = data.thisPost.frontmatter.title
  const venueDetails = data.venue && data.venue.edges.length > 0 && data.venue.edges[0].node

  return (
    <Layout
      location={location}
      description={`Photos, audio and video from ${gigTitle}.`}
      image={cover && getImage(cover)}
      title={`${gigTitle} | ${data.site.siteMetadata.title}`}
      date={data.thisPost.frontmatter.date}
      type="article"
      hideBrandOnMobile={true}
      scrollHeaderContent={
        <>
          <BackButton
            to={history.state && history.state.from ? history.state.from : undefined}
            gigSlug={data.thisPost.fields.slug}
            gigYear={data.thisPost.frontmatter.date.split(' ')[2]}
          />
          <HeaderTitle onClick={(e) => scrollTo(e, 'top')} href="#top" title="Scroll to top">
            <h1 className="big">{gigTitle}</h1>
          </HeaderTitle>
        </>
      }
    >
      <Banner
        id="top"
        title={gigTitle}
        subtitle={
          venueDetails && (
            <>
              at{' '}
              <Link to={venueDetails.fields.slug} className="highlighted">
                {venueDetails.frontmatter.title}
              </Link>
              <p>
                <small>{data.thisPost.frontmatter.date}</small>
              </p>
            </>
          )
        }
        backgroundImage={cover}
        customContent={<BannerContent data={data} location={location} />}
      >
        <HorizontalNav style={{ paddingTop: rhythm(1) }}>
          {data.thisPost.frontmatter.description && <p dangerouslySetInnerHTML={{ __html: data.thisPost.frontmatter.description }}></p>}
          {artistMedia.length == 0 && <LoadingSpinner />}
          {artistMedia.map((artist, index) => {
            return (
              <li key={index}>
                <a className="button" onClick={(e) => scrollTo(e, artist.machineName)} href={'#' + artist.machineName}>
                  {artist.title}
                </a>
              </li>
            )
          })}
        </HorizontalNav>
        {data.thisPost.frontmatter.feature_vid && <YouTubeResponsive videoId={data.thisPost.frontmatter.feature_vid} />}
      </Banner>
      <GigArtistMedia artistMedia={artistMedia} gigTitle={gigTitle} />
      <PlayerContainer artistAudio={artistAudio} />
      <BackToTop />
    </Layout>
  )
})

const HeaderTitle = styled.a`
  padding-left: ${rhythm(1)};
  width: 100%;
  h1 {
    font-size: 100%;
    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      font-size: ${rhythm(1.8)};
    }
  }
`

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
    images: allFile(
      filter: { relativePath: { regex: "/(.jpg)|(.JPG)$/" }, name: { ne: "cover.jpg" }, fields: { gigDir: { eq: $parentDir }, type: { eq: "gigs" } } }
    ) {
      group(field: relativeDirectory) {
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
    audio: allFile(filter: { relativePath: { regex: "/(.json)|(.mp3)$/" }, fields: { gigDir: { eq: $parentDir }, type: { eq: "gigs" } } }) {
      group(field: relativeDirectory) {
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

export default Page
