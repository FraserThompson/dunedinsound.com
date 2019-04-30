import React from 'react'
import { graphql, Link } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'
import Lightbox from 'react-image-lightbox'
import Layout from '../components/Layout'
import { toMachineName, graphqlGroupToObject } from  '../utils/helper'
import GridContainer from '../components/GridContainer'
import Banner from '../components/Banner'
import Divider from '../components/Divider'
import Player from '../components/Player'
import { rhythm, scale } from '../utils/typography'
import { calculateScrollHeaderOffset } from '../utils/helper'
import YouTubeResponsive from '../components/YouTubeResponsive'
import Tile from '../components/Tile'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp, MdPlayArrow, MdPause } from 'react-icons/md'
import HorizontalNav from '../components/HorizontalNav'
import RoundButton from '../components/RoundButton'
import ZoopUpWrapper from '../components/ZoopUpWrapper'
import FlexGridContainer from '../components/FlexGridContainer'
import { lighten } from 'polished'

const PlayerWrapper = styled.div`
  position: fixed;
  bottom: ${props => props.show ? "0px" : props.theme.headerHeightNeg };
  z-index: 11;
  overflow: visible;
  height: ${props => props.theme.headerHeight};
  margin-top: ${props => props.theme.headerHeightNeg};
  opacity: 1;
  background-color: ${props => props.theme.primaryColor};
  width: 100%;
  transition: bottom 150ms ease-in-out;
  .handle {
    position: absolute;
    text-align: center;
    width: 100%;
    bottom:  ${props => props.theme.headerHeight};
    svg {
      font-size: 2em;
      right: 12px;
      bottom: 2px;
      position: relative;
    }
    button {
      border: none;
      width: 40px;
      height: 30px;
      background-color: ${props => props.theme.foregroundColor};
      border-top-left-radius: 60px;
      border-top-right-radius: 60px;
      &:hover {
        background-color: ${props => lighten(0.2, props.theme.foregroundColor)};
      }
    }
  }
`

const NextPrevWrapper = styled.div`
  color: ${props => props.theme.textColor};
  position: absolute;
  right: ${props => props.prev ? "-10vw" : null};
  left: ${props => props.next ? "-10vw" : null};
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
    right: ${props => props.prev ? "10vw" : null};
    left: ${props => props.next ? "10vw" : null};
  }
  .tile {
    position: absolute;
    width: 100%;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
  &:hover {
    right: ${props => props.prev ? "0px" : null};
    left: ${props => props.next ? "0px" : null};
    box-shadow: ${props => props.prev ? "-6px 0px 12px rgba(0,0,0,.5)" : "6px 0px 12px rgba(0,0,0,.5)"};
    opacity: 1;
    .tile {
      opacity: 1;
    }
  }
`

const AudioSeek = styled.progress`
  height: 2px;
  &::-webkit-progress-bar {
    background-color: ${props => props.theme.foregroundColor};
  }
  &::-webkit-progress-value {
    background-color: ${props => props.theme.secondaryColor};
  }
  &::-moz-progress-bar {
    background-color: ${props => props.theme.foregroundColor};
  }
`

class GigTemplate extends React.Component {

  constructor(props) {
    super(props)

    this.scrollHeaderOffset = typeof window !== `undefined` && calculateScrollHeaderOffset(window)

    this.player = React.createRef()
    this.post = this.props.data.thisPost
    this.nextPost = this.props.data.nextPost
    this.prevPost = this.props.data.prevPost

    /* Pre-processed data */
    // Key-value object of images by artist
    const imagesByArtist = this.props.data.images && graphqlGroupToObject(this.props.data.images.group, true)

    // Key-value object of audio files by artist
    const audioByArtist = this.props.data.audio && this.props.data.audio['group'].reduce((obj, item) => {
      const machineName = item.fieldValue
      const grouped_audio = item.edges.reduce((obj, item) => {
        const name = item.node.name.replace(".mp3", "") // because old audio file JSON has mp3 in the name
        if (!obj[name]) obj[name] = {};
        obj[name][item.node.ext] = item.node;
        return obj;
      }, {});

      obj[machineName] = Object.keys(grouped_audio).map(item => grouped_audio[item])
      return obj
    }, {})

    // Key-value object of details by artist
    const detailsByArtist = this.props.data.artists && graphqlGroupToObject(this.props.data.artists.group)

    // Collect all the above into one array of artists with all their media
    this.artistMedia = this.post.frontmatter.artists.map(artist => {
      const machineName = toMachineName(artist.name)
      return {
        ...artist,
        machineName,
        title: detailsByArtist && detailsByArtist[machineName] ? detailsByArtist[machineName][0].node.frontmatter.title : artist.name,
        images: imagesByArtist && imagesByArtist[machineName],
        audio: audioByArtist && audioByArtist[machineName]
      }
    })

    // Cover image is either one image or all the images in the _header folder
    this.cover = imagesByArtist['_header'] || this.post.frontmatter.cover

    // Audio by artist
    this.artistAudio = this.artistMedia.filter(thing => thing.audio)

    // Details for the venue
    this.venueDetails = this.props.data.venue && this.props.data.venue.edges.length > 0 && this.props.data.venue.edges[0].node

    /* Display elements */
    // Tile for next gig
    this.nextTile = (
      this.nextPost &&
      <NextPrevWrapper next>
        <div className="icon">
        <MdKeyboardArrowLeft/>
        </div>
        <Tile
          key={this.nextPost.fields.slug}
          title={this.nextPost.frontmatter.title}
          image={this.nextPost.frontmatter.cover}
          label={this.nextPost.frontmatter.date}
          height="100%"
          href={this.nextPost.fields.slug}
        />
      </NextPrevWrapper>
    )

    // Tile for previous gig
    this.prevTile = (
      this.prevPost &&
      <NextPrevWrapper prev>
        <div className="icon">
          <MdKeyboardArrowRight/>
        </div>
        <Tile
          key={this.prevPost.fields.slug}
          title={this.prevPost.frontmatter.title}
          image={this.prevPost.frontmatter.cover}
          label={this.prevPost.frontmatter.date}
          height="100%"
          href={this.prevPost.fields.slug}
        />
      </NextPrevWrapper>
    )

    this.gigDescription = `See photos, audio and video from ${this.post.frontmatter.title} and heaps of other local gigs.`

    this.state = {
      scrolled: false,
      lightboxOpen: false,
      playerOpen: false,
      selectedImage: undefined,
      playing: false,
      selectedAudio: null
    }

  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.onScroll, {passive: true});
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if (window.pageYOffset > this.scrollHeaderOffset) {
      !this.state.scrolled && this.setState({scrolled: true})
    } else {
      this.state.scrolled && this.setState({scrolled: false})
    }
  }

  // Scrolling to an achor. We do this because hash changes trigger re-renders.
  scrollTo = (e, anchor) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById(anchor).scrollIntoView({behavior: "smooth"})
  }

  openLightbox = (artistIndex, imageIndex, event) => {
    event.preventDefault()
    this.gotoLightboxImage({ artistIndex, imageIndex })
  }

  gotoLightboxImage = ({ artistIndex, imageIndex }) => {
    this.setState({ lightboxOpen: true, selectedImage: { artistIndex, imageIndex } })
  }

  getNextImage = () => {
    const currentArtistIndex = this.state.selectedImage.artistIndex;
    const currentImageIndex = this.state.selectedImage.imageIndex

    if ((currentImageIndex + 1) >= this.artistMedia[currentArtistIndex].images.length && (currentArtistIndex + 1) <= this.artistMedia.length) {
      return { artistIndex: currentArtistIndex + 1, imageIndex: 0 }
    } else {
      return { artistIndex: currentArtistIndex, imageIndex: currentImageIndex + 1 }
    }
  }

  getPrevImage = () => {
    const currentArtistIndex = this.state.selectedImage.artistIndex;
    const currentImageIndex = this.state.selectedImage.imageIndex;

    if (currentImageIndex < 0 && currentArtistIndex > 0) {
      return { artistIndex: currentArtistIndex - 1, imageIndex: this.artistMedia[artistIndex - 1].images.length }
    } else {
      return { artistIndex: currentArtistIndex, imageIndex: currentImageIndex - 1 }
    }
  }

  getImageSrc = ({ artistIndex, imageIndex }) => {
    return this.artistMedia[artistIndex].images[imageIndex] && this.artistMedia[artistIndex].images[imageIndex].node.childImageSharp.fluid.src;
  }

  onYouTubeReady = (event) => {
    event.target.setPlaybackQuality("hd720")
  }

  playPause = (index) => {
    if (this.state.selectedAudio !== index) {
      this.setState({selectedAudio: index})
      this.player.current.selectArtist(index, true)
    } else {
      this.player.current.playPause()
    }
  }

  seekAudio = (e) => {
    const x = (e.nativeEvent.offsetX * 100 / e.target.offsetWidth) / 100;
    this.player.current.wavesurfer.seekTo(x);
  }

  render = () => {
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <Layout
        location={this.props.location}
        description={this.gigDescription}
        image={this.cover && this.cover.src}
        title={`${this.post.frontmatter.title} | ${siteTitle}`}
        hideBrand={this.state.scrolled}
        hideNav={this.state.scrolled}
        headerContent={this.state.scrolled && <a onClick={(e) => this.scrollTo(e, "top")} href="#top" title="Scroll to top"><h1 className="semi-big">{this.post.frontmatter.title}</h1></a>}
      >
        <Banner
          id="top"
          title={this.post.frontmatter.title}
          backgroundImage={this.cover} customContent={(
            <><ZoopUpWrapper title="BACK TO GIGS ☝" href="/gigs/"><p>☝ BACK TO GIGS ☝</p><MdKeyboardArrowUp/></ZoopUpWrapper>{this.prevTile}{this.nextTile}</>
          )}
        >
          <HorizontalNav>
            <p>{this.post.frontmatter.date} {this.venueDetails && <>at <Link to={this.venueDetails.fields.slug}>{this.venueDetails.frontmatter.title}</Link></>}</p>
            {this.post.frontmatter.description && <p>{this.post.frontmatter.description}</p>}
            {
              this.artistMedia.map((artist, index) => {
                return (
                  <li key={index}>
                    <a className="button" onClick={(e) => this.scrollTo(e, artist.machineName)} href={"#" + artist.machineName}>{artist.title}</a>
                  </li>
                )
              })
            }
          </HorizontalNav>
        </Banner>
        {this.artistMedia.map((artist, artistIndex) => {

            const imageElements = artist.images && artist.images.map(({node}, artistImageIndex) => {
              return <a style={{cursor: "pointer"}} key={artistImageIndex} onClick={e => this.openLightbox(artistIndex, artistImageIndex, e)}>
                <Img className="backgroundImage" fluid={node.childImageSharp.fluid} />
              </a>
            })

            const vidElements = artist.vid && artist.vid.map((video, vidIndex) => {
              const opts = {
                playerVars: {
                  modestbranding: "1"
                }
              };
              return <YouTubeResponsive videoId={video.link} onReady={this.onYouTubeReady} opts={opts} key={video.link} odd={(artist.vid.length % 2 !== 0 && vidIndex === artist.vid.length - 1) ? true : false}/>
            })

            const imageGridSize = {
              xs: "6",
              sm: "4",
              md: "3",
              lg: (imageElements && imageElements.length <= 6) ? "4" : (imageElements && imageElements.length <= 16) ? "3" : "2"
            }

            const isPlaying = this.state.playing && this.state.selectedAudio == artistIndex

            return (
              <div key={artistIndex} id={artist.machineName}>
                <Divider sticky={true}>
                  <a onClick={(e) => this.scrollTo(e, artist.machineName)} href={"#" + artist.machineName}><p style={{marginRight: rhythm(0.5)}}>{artist.title}</p></a>
                  {artist.audio && <>
                    <RoundButton
                      className={isPlaying ? "active" : ""}
                      onClick={() => this.playPause(artistIndex)}
                      size="30px"
                    >
                      {!isPlaying ? <MdPlayArrow/> : <MdPause/>}
                    </RoundButton>
                    <div onClick={this.seekAudio} style={{flexGrow: 1,display: "flex", alignSelf: "stretch", alignItems: "center"}}>
                      <AudioSeek style={{width: "100%"}} max="100" value={isPlaying && this.player.current && (this.player.current.wavesurfer.getCurrentTime() /this.player.current.wavesurfer.getDuration()) * 100}/>
                    </div>
                  </>}
                </Divider>
                <GridContainer xs="12" sm="6" md="6" lg="6">
                  {vidElements}
                </GridContainer>
                <FlexGridContainer {...imageGridSize}>
                  {imageElements}
                </FlexGridContainer>
              </div>
            )
          })
        }
        {this.artistAudio.length > 0 &&
          <PlayerWrapper show={this.state.playerOpen}>
            <div className="handle"><button title="Audio Player" onClick={() => this.setState({playerOpen: !this.state.playerOpen})}><MdKeyboardArrowUp/></button></div>
            <Player
              ref={this.player}
              artistMedia={this.artistAudio}
              onPlay={() => this.setState({playing: true, playerOpen: true})}
              onPause={() => this.setState({playing: false})}
              onFileChange={(index) => this.setState({selectedAudio: index, playerOpen: true})}
            />
          </PlayerWrapper>
        }
        {this.state.lightboxOpen &&
          <Lightbox
            mainSrc={this.getImageSrc({ artistIndex: this.state.selectedImage.artistIndex, imageIndex: this.state.selectedImage.imageIndex })}
            nextSrc={this.getImageSrc(this.getNextImage())}
            prevSrc={this.getImageSrc(this.getPrevImage())}
            onMovePrevRequest={() => this.gotoLightboxImage(this.getPrevImage())}
            onMoveNextRequest={() => this.gotoLightboxImage(this.getNextImage())}
            imageCaption={this.artistMedia[this.state.selectedImage.artistIndex].title}
            onCloseRequest={() => this.setState({ lightboxOpen: false })}
          />
        }
      </Layout>
    )
  }
}

export default GigTemplate

export const pageQuery = graphql`
  query GigsBySlug($slug: String!, $prevSlug: String, $nextSlug: String, $artists: [String]!, $venue: String!, $parentDir: String! ) {
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
    images: allFile( filter: {extension: {in: ["jpg", "JPG"]}, fields: { gigDir: {eq: $parentDir}, type: { eq: "gigs"}}}) {
      group(field: fields___parentDir) {
        fieldValue
        edges {
          node {
            name
            publicURL
            ...FullImage
          }
        }
      }
    }
    audio: allFile( filter: {extension: {in: ["mp3", "json"]}, fields: { gigDir: {eq: $parentDir}, type: { eq: "gigs"}}}) {
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
    artists: allMarkdownRemark(filter: { fields: { machine_name: { in: $artists }, type: { eq: "artists" } } } ) {
      group(field: fields___machine_name) {
        fieldValue
        edges {
          node {
            fields {
              machine_name
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
    venue: allMarkdownRemark(filter: { fields: { machine_name: { eq: $venue }, type: { eq: "venues" } } } ) {
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
