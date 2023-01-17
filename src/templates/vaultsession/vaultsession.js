import React, { useState, useEffect, useCallback } from 'react'
import { graphql, Link } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../../components/Layout'
import World from '../../components/World'
import YouTubeResponsive from '../../components/YouTubeResponsive'
import PlayerContainer from '../../components/PlayerContainer'
import VideoControls from './VideoControls'
import { timeToSeconds } from '../../utils/helper'
import { SiteHead } from '../../components/SiteHead'

const Page = ({ data }) => {
  const post = data?.thisPost

  const [lights, setLights] = useState('off')
  const [artistAudio, setArtistAudio] = useState(null)
  const [playerTarget, setPlayerTarget] = useState(null)
  const [hovered, setHovered] = useState(false)

  const getPlayerTarget = useCallback((target) => setPlayerTarget(target), [])

  const bottomContent = (
    <Logo position="bottom">
      <Link title="Back to all sessions" onMouseOver={() => setLights('on')} onMouseOut={() => setLights('off')} to="/vaultsessions">
        <img style={{ filter: 'invert(80%)' }} src={lights == 'off' ? data.logoMono.publicURL : data.logo.publicURL} />
      </Link>
    </Logo>
  )

  const topContent = (
    <Title>
      <h2 className="title">{post.title}</h2>
      <h4 className="subtitle">Recorded on {post.date}</h4>
    </Title>
  )

  const leftContent = playerTarget && artistAudio && (
    <VideoControls
      tracklist={artistAudio[0].tracklist}
      onHover={(inOrOut) => setHovered(inOrOut)}
      playerTarget={playerTarget}
      fullDownloadLink={artistAudio[0].audio[0]['.mp3'].publicURL}
    />
  )

  const rightContent = (
    <>
      {data.artist && (
        <Metadata onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <h3>More from this artist</h3>
          <ul>
            <li>
              <Link to={data.artist.fields.slug}>Gigs</Link>
            </li>
            {data.artist.facebook && (
              <li>
                <a href={data.artist.facebook}>Facebook</a>
              </li>
            )}
            {data.artist.bandcamp && (
              <li>
                <a href={data.artist.bandcamp}>Bandcamp</a>
              </li>
            )}
          </ul>
        </Metadata>
      )}
    </>
  )

  useEffect(() => {
    const audio = data.audio.nodes.reduce((obj, item) => {
      const name = item.name.replace('.mp3', '') // because old audio file JSON has mp3 in the name
      if (!obj[name]) obj[name] = {}
      obj[name][item.ext] = item
      return obj
    }, {})

    setArtistAudio([
      {
        title: post.title,
        audio: Object.values(audio),
        tracklist: post.tracklist.map((track) => {
          track.seconds = timeToSeconds(track.time)
          return track
        }),
      },
    ])
  }, [data])

  return (
    <Layout
      location={typeof window !== `undefined` && window.location}
      image={data.cover.publicURL}
      hideBrandOnMobile={true}
      hideFooter={true}
      overrideBackgroundColor="white"
    >
      <World lights={lights} topContent={topContent} bottomContent={bottomContent} leftContent={leftContent} rightContent={rightContent}>
        <VideoWrapper hovered={hovered}>
          <YouTubeResponsive videoId={post.full_video} getPlayerTarget={getPlayerTarget} vanilla />
        </VideoWrapper>
      </World>
      {artistAudio && <PlayerContainer artistAudio={artistAudio} minimizedAlways={true} />}
    </Layout>
  )
}

export const Head = (params) => {
  const cover = params.data.cover
  const description = params.data.thisPost.excerpt

  return (
    <SiteHead title={`VAULT SESSIONS: ${params.data.thisPost.title}`} cover={cover} description={description} date={params.data.thisPost.date} {...params} />
  )
}

const Logo = styled.div`
  margin: 0 auto;
  position: absolute;
  top: ${(props) => props.position == 'top' && '0px'};
  bottom: ${(props) => props.position == 'bottom' && '0px'};
  z-index: 2;
  width: 100%;
  img {
    opacity: 1;
    width: 100%;
  }
`
const Title = styled.div`
  position: absolute;
  top: 0px;
  z-index: 2;
  width: 100%;
  text-align: center;
  .title,
  .subtitle {
    font-family: monospace;
  }
`

const VideoWrapper = styled.div`
  background-color: black;
  bottom: 0;
  transform-origin: center bottom;
  transform: translateZ(-50px) translateY(-50%) translateX(-50%) rotateX(${(props) => (props.hovered ? '90deg' : '0deg')});
  width: 100vw;
  z-index: 4;
  position: relative;
  top: 50%;
  left: 50%;
  transition-property: transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    width: 60vw;
    transform: translateZ(-50px) translateY(-50%) translateX(-50%);
  }
`

const Metadata = styled.div`
  transition-property: z-index, transform, background, box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  position: absolute;
  right: 0;
  z-index: 3;
  transform-origin: right center;
  font-family: monospace;
  &:hover {
    z-index: 10;
    box-shadow: 0 0 30px purple;
    transform: rotateY(80deg);
    background: rgba(0, 0, 0, 1);
  }
`

export const pageQuery = graphql`
  query Vaultsession($slug: String!, $fileName: String!, $type: String!) {
    thisPost: vaultsessionYaml(fields: { slug: { eq: $slug } }) {
      ...VaultsessionFrontmatter
    }
    logo: file(name: { eq: "vslogo" }) {
      publicURL
    }
    logoMono: file(name: { eq: "vslogo_mono" }) {
      publicURL
    }
    cover: file(fields: { mediaDir: { eq: $type }, parentDir: { eq: $fileName } }, name: { eq: "cover" }) {
      publicURL
      ...MediumImage
    }
    audio: allFile(
      filter: { sourceInstanceName: { eq: "media" }, extension: { in: ["mp3", "json"] }, fields: { mediaDir: { eq: $type }, parentDir: { eq: $fileName } } }
    ) {
      nodes {
        name
        publicURL
        ext
      }
    }
    artist: artistYaml(fields: { fileName: { eq: $fileName } }) {
      ...ArtistFrontmatter
    }
  }
`

export default Page
