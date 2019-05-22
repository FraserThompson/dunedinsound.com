import React from 'react'
import { graphql, Link } from 'gatsby'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import World from '../components/World'
import YouTubeResponsive from '../components/YouTubeResponsive'
import PlayerContainer from '../components/PlayerContainer';

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
  top: ${props => props.position == "top" && "0px"};
  bottom: ${props => props.position == "bottom" && "0px"};
  z-index: 2;
  width: 100%;
  transform: ${props => props.position == "top" ? "rotateX(-90deg)" : "rotateX(90deg);"};
  transform-origin: ${props => props.position == "top" ? "center top" : "center bottom"};
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
  transform: translateZ(-50px) translateY(-50%);
  width: 100vw;
  z-index: 4;
  position: relative;
  top: 50%;

  @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
    transform: translateZ(-300px) translateY(0%);
    top: initial;
  }

`

const Tracklist = styled.ul`
  transition: all 0.2s ease-in-out;
  transform: rotateY(90deg);
  position: absolute;
  left: 0;
  z-index: 3;
  transform-origin: left center;
  background: rgba(0,0,0,0);
  &:hover {
    z-index: 10;
    transform: rotateY(20deg);
    background: rgba(0,0,0,1);
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
    background: rgba(0,0,0,1);
  }
`

class VaultSessionTemplate extends React.Component {

  constructor(props) {
    super(props)

    const {data} = this.props
    const post = data.markdownRemark

    const audio = data.audio.edges.reduce((obj, item) => {
      const name = item.node.name.replace(".mp3", "") // because old audio file JSON has mp3 in the name
      if (!obj[name]) obj[name] = {};
      obj[name][item.node.ext] = item.node;
      return obj;
    }, {})

    this.audio = [
      {
        title: post.frontmatter.title,
        audio: Object.values(audio),
        tracklist: post.frontmatter.tracklist
      }
   ]

    this.state = {
      lights: "off"
    }
  }

  lightsOn = () => {
    this.setState({lights: "on"});
  }

  lightsOff = () => {
    this.setState({lights: "off"});
  }

  render() {
    const {data} = this.props
    const post = data.markdownRemark
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = post.excerpt ? post.excerpt : data.site.siteMetadata.description
    const artist = data.artist.edges[0].node

    return (
      <Layout location={this.props.location} description={siteDescription} image={post.frontmatter.cover.publicURL} title={`VAULT SESSION: ${post.frontmatter.title} | ${siteTitle}`} overrideBackgroundColor="white">
        <World lights={this.state.lights}>
          <Title>
            <h1>{post.frontmatter.title}</h1>
          </Title>
          <Tracklist>
            <h2>Tracklist</h2>
            {
              post.frontmatter.tracklist.map(video =>
                <li key={video.link}>{video.title} ({video.time}) <a target="_blank" href={`https://youtube.com/watch?v=${video.link}`}>(Video)</a></li>
              )
            }
          </Tracklist>
          <Metadata>
            <h2>More from this artist</h2>
            <ul>
              <li><Link to={artist.fields.slug}>Gigs</Link></li>
              <li><a href={artist.frontmatter.facebook}>Facebook</a></li>
              <li><a href={artist.frontmatter.bandcamp}>Bandcamp</a></li>
            </ul>
          </Metadata>
          <VideoWrapper>
            <YouTubeResponsive videoId={post.frontmatter.full_video} vanilla/>
          </VideoWrapper>
          <Logo position="bottom">
            <Link title="Back to all sessions" onMouseOver={this.lightsOn} onMouseOut={this.lightsOff} to="/vaultsessions"><img style={{filter: "invert(80%)"}} src={this.state.lights == "off" ? data.logoMono.publicURL : data.logo.publicURL}/></Link>
          </Logo>
        </World>
        <PlayerContainer artistMedia={this.audio}/>
      </Layout>
    )
  }
}

export default VaultSessionTemplate

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
    audio: allFile( filter: {extension: {in: ["mp3", "json"]}, fields: { parentDir: {eq: $parentDir}, type: { eq: "vaultsessions"}}}) {
      edges {
        node {
          name
          publicURL
          ext
        }
      }
    }
    artist: allMarkdownRemark(filter: { fields: { machine_name: { eq: $parentDir }, type: { eq: "artists" } } } ) {
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
        full_video
        tracklist { title, link, time }
        cover {
          publicURL
        }
      }
    }
  }
`
