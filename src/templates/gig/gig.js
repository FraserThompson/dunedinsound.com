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
import ImageGallery from '../../components/ImageGallery'
import { SiteHead } from '../../components/SiteHead'
import Divider from '../../components/Divider'

const Page = React.memo(({ data, pageContext }) => {
  const [artistMedia, setArtistMedia] = useState([])
  const [artistAudio, setArtistAudio] = useState([])
  const [cover, setCover] = useState(null)
  const [uncategorizedImages, setUncategorizedImages] = useState([])

  const location = typeof window !== `undefined` && window.location
  const history = typeof window !== `undefined` && window.history

  const { previous, next } = pageContext

  // On page load
  useEffect(() => {
    if (typeof window !== `undefined` && window.previousPath && window.previousPath !== location.href) {
      // We need to scroll to top manually because we disabled Gatsby's default behavior (see gatsby-browser.js) so our
      // lightbox back button feature works.
      window.scrollTo(0, 0)
    }

    // Key-value object of images by artist
    const imagesByArtist = data.images && graphqlGroupToObject(data.images.group, true, (fieldValue) => fieldValue.split('/')[2] || 'cover')

    // Cover image is either one image or all the images in the _header folder
    imagesByArtist['_header'] ? setCover(imagesByArtist['_header']) : setCover(data.cover)
    imagesByArtist['_uncategorized'] && setUncategorizedImages(imagesByArtist['_uncategorized'])

    // Key-value object of audio files by artist
    const audioByArtist =
      data.audio &&
      data.audio.group.reduce((obj, item) => {
        const machineName = item.fieldValue.split('/')[2]
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

    const combinedMedia = data.thisPost.artists.map((artist, i) => {
      const machineName = toMachineName(artist.name)
      return {
        ...artist,
        machineName,
        index: i,
        title: artist.name,
        details: detailsByArtist?.[machineName]?.[0],
        images: imagesByArtist?.[machineName],
        audio: audioByArtist?.[machineName],
      }
    })

    // Set the audio and image blobs to be consumed and displayed later
    setArtistAudio(combinedMedia.filter((thing) => thing.audio && thing.audio.length > 0))
    setArtistMedia(combinedMedia)
  }, [])

  const gigTitle = data.thisPost.title
  const venueDetails = data.venue && data.venue.nodes.length > 0 && data.venue.nodes[0]

  return (
    <Layout
      location={location}
      hideBrandOnMobile={true}
      scrollHeaderContent={
        <>
          <BackButton
            to={history.state && history.state.from ? history.state.from : undefined}
            gigSlug={data.thisPost.fields.slug}
            gigYear={data.thisPost.date.split(' ')[2]}
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
                {venueDetails.title}
              </Link>
              <p>
                <small>{data.thisPost.date}</small>
              </p>
            </>
          )
        }
        height="80vh"
        backgroundImage={cover}
        customContent={<BannerOverlay thisPost={data.thisPost} nextPost={next} prevPost={previous} location={location} />}
      >
        <HorizontalNav style={{ paddingTop: rhythm(1), paddingBottom: rhythm(1) }}>
          {data.thisPost.description && <p dangerouslySetInnerHTML={{ __html: data.thisPost.description }}></p>}
          {artistMedia.length == 0 && <LoadingSpinner />}
          {artistMedia.length > 1 &&
            !data.thisPost.audioOnly &&
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
        {data.thisPost.feature_vid && (
          <FeatureVidWrapper>
            <YouTubeResponsive videoId={data.thisPost.feature_vid} />
          </FeatureVidWrapper>
        )}
        <PlayerContainer artistAudio={artistAudio} />
      </Banner>
      {(uncategorizedImages.length || data.thisPost.intro) && <Divider sticky={'header'} backgroundColor={'black'} />}
      {data.thisPost.intro && (
        <BigIntroWrapper>
          <BigIntro>
            <h2 dangerouslySetInnerHTML={{ __html: data.thisPost.intro }} />
          </BigIntro>
        </BigIntroWrapper>
      )}
      {!!uncategorizedImages.length && <ImageGallery images={uncategorizedImages} masonry={true} title={gigTitle} />}
      {!data.thisPost.audioOnly && <ArtistMedia artistMedia={artistMedia} gigTitle={gigTitle} />}
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

const BigIntroWrapper = styled.div`
  background-color: black;
`

const BigIntro = styled.div`
  text-align: center;
  max-width: ${(props) => props.theme.contentContainerWidth};
  margin: 0 auto;
  padding: ${rhythm(1)};

  > h2 {
    font-size: ${rhythm(1.2)};
    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      font-size: ${rhythm(1.5)};
    }
    font-family: monospace;
  }
`

export const Head = (params) => {
  const cover = params.data.cover

  return (
    <SiteHead
      title={params.data.thisPost.title}
      description={`Photos, audio and video from ${params.data.thisPost.title}.`}
      date={params.data.thisPost.date}
      cover={cover}
      {...params}
    />
  )
}

export const pageQuery = graphql`
  query GigsBySlug($slug: String, $type: String, $artists: [String]!, $venue: String!, $fileName: String!) {
    thisPost: gigYaml(fields: { slug: { eq: $slug } }) {
      ...GigFrontmatter
    }
    cover: file(sourceInstanceName: { eq: "media" }, name: { eq: "cover" }, fields: { mediaDir: { eq: $type }, gigDir: { eq: $fileName } }) {
      publicURL
      ...LargeImage
    }
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "media" }
        ext: { in: [".jpg", ".JPG"] }
        name: { ne: "cover" }
        fields: { mediaDir: { eq: $type }, gigDir: { eq: $fileName } }
      }
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
    audio: allFile(
      filter: { sourceInstanceName: { eq: "media" }, ext: { in: [".json", ".mp3"] }, fields: { mediaDir: { eq: $type }, gigDir: { eq: $fileName } } }
    ) {
      group(field: { relativeDirectory: SELECT }) {
        fieldValue
        nodes {
          name
          publicURL
          ext
        }
      }
    }
    artists: allArtistYaml(filter: { title: { in: $artists } }) {
      group(field: { fields: { fileName: SELECT } }) {
        fieldValue
        nodes {
          fields {
            fileName
            slug
          }
          title
          bandcamp
          facebook
          instagram
        }
      }
    }
    venue: allVenueYaml(filter: { fields: { fileName: { eq: $venue } } }) {
      nodes {
        fields {
          fileName
          slug
        }
        title
      }
    }
  }
`

export default Page
