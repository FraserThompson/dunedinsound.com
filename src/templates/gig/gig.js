import React, { useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../../components/Layout'
import { toMachineName, graphqlGroupToObject, scrollTo } from '../../utils/helper'
import Banner from '../../components/Banner'
import HorizontalNav from '../../components/HorizontalNav'
import PlayerContainer from '../../components/PlayerContainer'
import ArtistMedia from './ArtistMedia'
import YouTubeResponsive from '../../components/YouTubeResponsive'
import LoadingSpinner from '../../components/LoadingSpinner'
import BannerOverlay from './BannerOverlay'
import styled from '@emotion/styled'
import { rhythm } from '../../utils/typography'
import BackButton from '../../components/BackButton'
import BackToTop from '../../components/BackToTop'
import { getSrc } from 'gatsby-plugin-image'
import ImageGallery from '../../components/ImageGallery'
import { SiteHead } from '../../components/SiteHead'

const Page = React.memo(({ data }) => {
  const [artistMedia, setArtistMedia] = useState([])
  const [artistAudio, setArtistAudio] = useState([])
  const [cover, setCover] = useState(data.thisPost.frontmatter.cover)
  const [uncategorizedImages, setUncategorizedImages] = useState([])

  const location = typeof window !== `undefined` && window.location
  const history = typeof window !== `undefined` && window.history

  // On page load
  useEffect(() => {
    if (typeof window !== `undefined` && window.previousPath && window.previousPath !== location.href) {
      // We need to scroll to top manually because we disabled Gatsby's default behavior (see gatsby-browser.js) so our
      // lightbox back button feature works.
      window.scrollTo(0, 0)
    }

    // Key-value object of images by artist
    const imagesByArtist = data.images && graphqlGroupToObject(data.images.group, true, (fieldValue) => fieldValue.split('/')[1])

    // Cover image is either one image or all the images in the _header folder
    imagesByArtist['_header'] && setCover(imagesByArtist['_header'])
    imagesByArtist['_uncategorized'] && setUncategorizedImages(imagesByArtist['_uncategorized'])

    // Key-value object of audio files by artist
    const audioByArtist =
      data.audio &&
      data.audio['group'].reduce((obj, item) => {
        const machineName = item.fieldValue.split('/')[1]
        const grouped_audio = item.nodes.reduce((obj, item) => {
          // There appears to be a bug in the GraphQL extension filter which sometimes allows images to slip
          // through... So instead of pursuing that we'll just add this check here.
          if (item.ext !== '.json' && item.ext !== '.mp3') return obj

          const name = item.name.replace('.mp3', '') // because old audio file JSON has mp3 in the name

          if (!obj[name]) obj[name] = {}
          obj[name][item.ext] = item
          return obj
        }, {})

        obj[machineName] = Object.keys(grouped_audio).map((item) => grouped_audio[item])
        return obj
      }, {})

    // Key-value object of details by artist
    const detailsByArtist = data.artists && graphqlGroupToObject(data.artists.group)

    const combinedMedia = data.thisPost.frontmatter.artists.map((artist, i) => {
      const machineName = toMachineName(artist.name)
      return {
        ...artist,
        machineName,
        index: i,
        title: detailsByArtist && detailsByArtist[machineName] ? detailsByArtist[machineName][0].frontmatter.title : artist.name,
        details: detailsByArtist && detailsByArtist[machineName] && detailsByArtist[machineName][0],
        images: imagesByArtist && imagesByArtist[machineName],
        audio: audioByArtist && audioByArtist[machineName],
      }
    })

    // Set the audio and image blobs to be consumed and displayed later
    setArtistAudio(combinedMedia.filter((thing) => thing.audio && thing.audio.length > 0))
    setArtistMedia(combinedMedia)
  }, [])

  const gigTitle = data.thisPost.frontmatter.title
  const venueDetails = data.venue && data.venue.nodes.length > 0 && data.venue.nodes[0]

  return (
    <Layout
      location={location}
      image={cover && getSrc(cover)}
      title={`${gigTitle} | ${data.site.siteMetadata.title}`}
      date={data.thisPost.frontmatter.date}
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
        height="80vh"
        backgroundImage={cover}
        customContent={<BannerOverlay data={data} location={location} />}
      >
        <HorizontalNav style={{ paddingTop: rhythm(1), paddingBottom: rhythm(1) }}>
          {data.thisPost.frontmatter.description && <p dangerouslySetInnerHTML={{ __html: data.thisPost.frontmatter.description }}></p>}
          {artistMedia.length == 0 && <LoadingSpinner />}
          {artistMedia.length > 1 &&
            !data.thisPost.frontmatter.audioOnly &&
            artistMedia.map((artist, index) => {
              return (
                <li key={index}>
                  <a className="button" onClick={(e) => scrollTo(e, artist.machineName)} href={`#${artist.machineName}`}>
                    {artist.title}
                  </a>
                </li>
              )
            })}
        </HorizontalNav>
        {data.thisPost.frontmatter.feature_vid && (
          <FeatureVidWrapper>
            <YouTubeResponsive videoId={data.thisPost.frontmatter.feature_vid} />
          </FeatureVidWrapper>
        )}
        <PlayerContainer artistAudio={artistAudio} />
      </Banner>
      {uncategorizedImages && <ImageGallery images={uncategorizedImages} masonry={true} title={gigTitle} />}
      {!data.thisPost.frontmatter.audioOnly && <ArtistMedia artistMedia={artistMedia} gigTitle={gigTitle} />}
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

const FeatureVidWrapper = styled.div`
  padding-bottom: ${rhythm(1)};
`

export const Head = (params) => {
  const cover = params.data.thisPost.frontmatter.cover
  const title = `${params.data.thisPost.frontmatter.title} | ${params.data.site.siteMetadata.title}`

  return (
    <SiteHead
      title={title}
      description={`Photos, audio and video from ${params.data.thisPost.frontmatter.title}.`}
      date={params.data.thisPost.frontmatter.date}
      cover={cover}
      {...params}
    />
  )
}

export const pageQuery = graphql`
  query GigsBySlug($slug: String!, $prevSlug: String, $nextSlug: String, $artists: [String]!, $venue: String!, $parentDir: String!) {
    site {
      ...SiteInformation
    }
    thisPost: mdx(fields: { slug: { eq: $slug } }) {
      ...GigFrontmatter
    }
    nextPost: mdx(fields: { slug: { eq: $nextSlug } }) {
      ...GigTileFrontmatter
    }
    prevPost: mdx(fields: { slug: { eq: $prevSlug } }) {
      ...GigTileFrontmatter
    }
    images: allFile(
      filter: { relativePath: { regex: "/(.jpg)|(.JPG)$/" }, name: { ne: "cover.jpg" }, fields: { gigDir: { eq: $parentDir }, type: { eq: "gigs" } } }
    ) {
      group(field: { relativeDirectory: SELECT }) {
        fieldValue
        totalCount
        nodes {
          name
          publicURL
          ...MediumImage
        }
      }
    }
    audio: allFile(filter: { relativePath: { regex: "/(.json)|(.mp3)$/" }, fields: { gigDir: { eq: $parentDir }, type: { eq: "gigs" } } }) {
      group(field: { relativeDirectory: SELECT }) {
        fieldValue
        nodes {
          name
          publicURL
          ext
        }
      }
    }
    artists: allMdx(filter: { fields: { machine_name: { in: $artists }, type: { eq: "artists" } } }) {
      group(field: { fields: { machine_name: SELECT } }) {
        fieldValue
        nodes {
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
    venue: allMdx(filter: { fields: { machine_name: { eq: $venue }, type: { eq: "venues" } } }) {
      nodes {
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
`

export default Page
