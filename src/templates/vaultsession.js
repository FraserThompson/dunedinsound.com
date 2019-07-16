import React, { useState, useEffect, useCallback } from 'react'
import { graphql, Link } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import World from '../components/World'
import YouTubeResponsive from '../components/YouTubeResponsive'
import PlayerContainer from '../components/PlayerContainer'

const minutesToSeconds = time => {
  const timeComponents = time.split(':')
  return parseInt(timeComponents[0]) * 60 + parseInt(timeComponents[1])
}

const VideoControls = ({ tracklist, playerTarget, fullDownloadLink }) => {
  const [playerSeconds, setPlayerSeconds] = useState(0)

  const seekVideoTo = useCallback(
    time => {
      playerTarget && playerTarget.seekTo(time, true)
      setPlayerSeconds(time)
    },
    [playerTarget]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerSeconds(playerTarget.getCurrentTime())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Tracklist>
      <h3>Tracklist (click to seek)</h3>
      {tracklist.map((video, index) => {
        const nextTrackSeconds = index + 1 < tracklist.length && tracklist[index + 1].seconds
        return (
          <Track key={video.link} active={playerSeconds >= video.seconds && (nextTrackSeconds ? playerSeconds < nextTrackSeconds : true)}>
            <a className="trackTitle" onClick={() => seekVideoTo(video.seconds)}>
              {video.title}
            </a>{' '}
            <a target="_blank" href={`https://youtube.com/watch?v=${video.link}`}>
              <small>(Video)</small>
            </a>
          </Track>
        )
      })}
      {fullDownloadLink && (
        <a title="FULL MP3 DOWNLOAD" target="_blank" href={fullDownloadLink}>
          <h3 className="coolText">🌟FULL MP3 DOWNLOAD🌟</h3>
        </a>
      )}
    </Tracklist>
  )
}

export default ({ data, location }) => {
  const post = data.markdownRemark

  const siteTitle = data.site.siteMetadata.title
  const siteDescription = post.excerpt ? post.excerpt : data.site.siteMetadata.description
  const artist = data.artist.edges[0].node

  const [lights, setLights] = useState('off')
  const [artistAudio, setArtistAudio] = useState(null)
  const [playerTarget, setPlayerTarget] = useState(null)

  const getPlayerTarget = useCallback(target => setPlayerTarget(target), [])

  useEffect(() => {
    const audio = data.audio.edges.reduce((obj, item) => {
      const name = item.node.name.replace('.mp3', '') // because old audio file JSON has mp3 in the name
      if (!obj[name]) obj[name] = {}
      obj[name][item.node.ext] = item.node
      return obj
    }, {})

    setArtistAudio([
      {
        title: post.frontmatter.title,
        audio: Object.values(audio),
        tracklist: post.frontmatter.tracklist.map(track => {
          track.seconds = minutesToSeconds(track.time)
          return track
        }),
      },
    ])
  }, [data])

  return (
    <Layout
      location={location}
      description={siteDescription}
      image={post.frontmatter.cover.publicURL}
      title={`VAULT SESSION: ${post.frontmatter.title} | ${siteTitle}`}
      overrideBackgroundColor="white"
    >
      <World lights={lights}>
        <Title>
          <h2>{post.frontmatter.title}</h2>
          <h4>Recorded on {post.frontmatter.date}</h4>
        </Title>
        {playerTarget && artistAudio && (
          <VideoControls tracklist={artistAudio[0].tracklist} playerTarget={playerTarget} fullDownloadLink={artistAudio[0].audio[0]['.mp3'].publicURL} />
        )}
        <Metadata>
          <h3>More from this artist</h3>
          <ul>
            <li>
              <Link to={artist.fields.slug}>Gigs</Link>
            </li>
            {artist.frontmatter.facebook && (
              <li>
                <a href={artist.frontmatter.facebook}>Facebook</a>
              </li>
            )}
            {artist.frontmatter.bandcamp && (
              <li>
                <a href={artist.frontmatter.bandcamp}>Bandcamp</a>
              </li>
            )}
          </ul>
        </Metadata>
        <VideoWrapper>
          <YouTubeResponsive videoId={post.frontmatter.full_video} getPlayerTarget={getPlayerTarget} vanilla />
        </VideoWrapper>
        <Logo position="bottom">
          <Link title="Back to all sessions" onMouseOver={() => setLights('on')} onMouseOut={() => setLights('off')} to="/vaultsessions">
            <img style={{ filter: 'invert(80%)' }} src={lights == 'off' ? data.logoMono.publicURL : data.logo.publicURL} />
          </Link>
        </Logo>
      </World>
      {artistAudio && <PlayerContainer artistAudio={artistAudio} />}
    </Layout>
  )
}

const Title = styled.div`
  position: absolute;
  top: 0px;
  z-index: 2;
  width: 100%;
  transform: rotateX(-90deg);
  transform-origin: center top;
  text-align: center;
  h1 {
    opacity: 0.5;
    margin: 0 auto;
  }
`

const Logo = styled.div`
  margin: 0 auto;
  position: absolute;
  top: ${props => props.position == 'top' && '0px'};
  bottom: ${props => props.position == 'bottom' && '0px'};
  z-index: 2;
  width: 100%;
  transform: ${props => (props.position == 'top' ? 'rotateX(-90deg)' : 'rotateX(90deg);')};
  transform-origin: ${props => (props.position == 'top' ? 'center top' : 'center bottom')};
  img {
    transform: translateZ(-50px);
    opacity: 1;
    width: 100%;
  }
`

const VideoWrapper = styled.div`
  background-color: black;
  bottom: 0;
  transform-origin: center bottom;
  transform: translateZ(-50px) translateY(-50%) translateX(-50%);
  width: 100vw;
  z-index: 4;
  position: relative;
  top: 50%;
  left: 50%;

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    width: 60vw;
  }
`

const Tracklist = styled.ul`
  transition: all 0.2s ease-in-out;
  transform: rotateY(90deg);
  position: absolute;
  left: 0;
  z-index: 3;
  transform-origin: left center;
  background: rgba(0, 0, 0, 0);
  &:hover {
    z-index: 10;
    transform: rotateY(20deg);
    background: rgba(0, 0, 0, 1);
  }
`

const Track = styled.li`
  a {
    cursor: pointer;
  }
  .trackTitle {
    color: ${props => props.active && props.theme.secondaryColor};
    font-weight: ${props => props.active && 'bold'};
  }
`

const Metadata = styled.div`
  transition: all 0.2s ease-in-out;
  transform: rotateY(-90deg);
  position: absolute;
  right: 0;
  z-index: 3;
  transform-origin: right center;
  &:hover {
    z-index: 10;
    transform: rotateY(-20deg);
    background: rgba(0, 0, 0, 1);
  }
`

export const pageQuery = graphql`
  query VaultsessionPostBySlug($slug: String!, $parentDir: String!) {
    site {
      ...SiteInformation
    }
    logo: file(name: { eq: "vslogo" }) {
      publicURL
    }
    logoMono: file(name: { eq: "vslogo_mono" }) {
      publicURL
    }
    audio: allFile(filter: { extension: { in: ["mp3", "json"] }, fields: { parentDir: { eq: $parentDir }, type: { eq: "vaultsessions" } } }) {
      edges {
        node {
          name
          publicURL
          ext
        }
      }
    }
    artist: allMarkdownRemark(filter: { fields: { machine_name: { eq: $parentDir }, type: { eq: "artists" } } }) {
      edges {
        node {
          fields {
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "DD MMMM YYYY")
        full_video
        tracklist {
          title
          link
          time
        }
        cover {
          publicURL
        }
      }
    }
  }
`
