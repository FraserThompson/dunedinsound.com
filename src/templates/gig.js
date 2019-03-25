import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'
import Lightbox from 'react-image-lightbox';
import Layout from '../components/Layout'
import Helper from  '../utils/helper';
import GridContainer from '../components/GridContainer';
import Banner from '../components/Banner';
import Divider from '../components/Divider';
import Player from '../components/Player';
import { rhythm } from '../utils/typography';

const PlayerWrapper = styled.div`
  position: relative;
  position: fixed;
  bottom: 0px;
  z-index: 11;
  overflow: visible;
  height: ${props => props.theme.headerHeight};
  margin-top: ${props => props.theme.headerHeightNeg};
  opacity: 1;
  background-color: ${props => props.theme.headerColor};
  width: 100vw;
  -webkit-transition: background-color 0.5s ease;
  -moz-transition: background-color 0.5s ease;
  transition: background-color 0.5s ease;
`

const HorizontalNav = styled.ul`
  background-color: transparent;
  width: auto;
  max-height: 40vh;
  overflow-y: auto;

  li {
    display: inline-block;
    line-height: 40px;
    padding-right: ${rhythm(0.5)};
    button {
      padding-right: ${rhythm(1)};
      padding-left: ${rhythm(1)};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`

class GigTemplate extends React.Component {

  constructor(props) {
    super(props);

    const post = this.props.data.thisPost
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt

    // Turn the data returned from the images query into a key-value object of images by artist
    const imagesByArtist = this.props.data.images && this.props.data.images['group'].reduce((obj, item) => {
      const machineName = item.fieldValue
      const images = item.edges.map(file => file.node.childImageSharp.fluid)
      obj[machineName] = images
      return obj
    }, {})

    // Turn the data returned from the audio query into a key-value object of audio files by artist
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

    // Turn the data returned from the artist query into a key-value object of details by artist
    const detailsByArtist = this.props.data.artists && this.props.data.artists['group'].reduce((obj, item) => {
      const machineName = item.edges[0].node.fields.machine_name
      const frontmatter = item.edges[0].node.frontmatter
      obj[machineName] = frontmatter
      return obj
    }, {})

    // Collect all the above into one array of artists with all their media
    const artistMedia = post.frontmatter.artists.map(artist => {
      const machineName = Helper.machineName(artist.name)
      return {
        ...artist,
        title: detailsByArtist && detailsByArtist[machineName] ? detailsByArtist[machineName].title : artist.name,
        images: imagesByArtist && imagesByArtist[machineName],
        audio: audioByArtist && audioByArtist[machineName]
      }
    })

    const venueDetails = this.props.data.venue && this.props.data.venue.edges[0].node

    this.state = {
      post,
      siteTitle,
      siteDescription,
      artistMedia,
      venueDetails,
      lightboxOpen: false,
      selectedImage: undefined,
      selectedArtist: artistMedia[0]
    }

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

    if ((currentImageIndex + 1) >= this.state.artistMedia[currentArtistIndex].images.length && (currentArtistIndex + 1) <= this.state.artistMedia.length) {
      return { artistIndex: currentArtistIndex + 1, imageIndex: 0 }
    } else {
      return { artistIndex: currentArtistIndex, imageIndex: currentImageIndex + 1 }
    }
  }

  getPrevImage = () => {
    const currentArtistIndex = this.state.selectedImage.artistIndex;
    const currentImageIndex = this.state.selectedImage.imageIndex;

    if (currentImageIndex < 0 && currentArtistIndex > 0) {
      return { artistIndex: currentArtistIndex - 1, imageIndex: this.state.artistMedia[artistIndex - 1].images.length }
    } else {
      return { artistIndex: currentArtistIndex, imageIndex: currentImageIndex - 1 }
    }
  }

  getImageSrc = ({ artistIndex, imageIndex }) => {
    return this.state.artistMedia[artistIndex].images[imageIndex] && this.state.artistMedia[artistIndex].images[imageIndex].src;
  }

  render() {

    const { previous, next } = this.props.pageContext

    const playlist = this.state.artistMedia.map((artist, index) => {
      return (
        <li key={index}>
          <a className="button" href={"#" + artist.name}>{artist.title}</a>
        </li>
      )
    })

    // Iterate over all the media and gather it
    const mediaByArtist = this.state.artistMedia.map((artist, artistIndex) => {

      const imageElements = artist.images && artist.images.map((fluidImage, artistImageIndex) => {
        return <a key={artistImageIndex} href={fluidImage.src} onClick={e => this.openLightbox(artistIndex, artistImageIndex, e)}>
          <Img fluid={fluidImage} />
        </a>
      })

      const vidElements = artist.vid && artist.vid.map(video => <div key={video.link}><p>{video.link}</p></div>)

      return (
        <div key={artistIndex}>
          <Divider sticky={true}>
            <p id={artist.name}>{artist.title}</p>
          </Divider>
          <GridContainer xs="12" sm="6" md="6" lg="6">
            {vidElements}
          </GridContainer>
          <GridContainer xs="6" sm="4" md="3" lg="2">
            {imageElements}
          </GridContainer>
        </div>
      )
    })

    return (
      <Layout location={this.props.location} title={this.state.siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: this.state.siteDescription }]}
          title={`${this.state.post.frontmatter.title} | ${this.state.siteTitle}`}
        />
        <Banner backgroundImage={this.state.post.frontmatter.cover && this.state.post.frontmatter.cover.childImageSharp.fluid}>
          <h1>{this.state.post.frontmatter.title}</h1>
          <HorizontalNav>{playlist}</HorizontalNav>
        </Banner>
        <PlayerWrapper>
          {this.state.selectedArtist.audio &&
            <Player artistMedia={this.state.artistMedia}></Player>
          }
        </PlayerWrapper>
        {mediaByArtist}
        {this.state.lightboxOpen &&
          <Lightbox
            mainSrc={this.getImageSrc({ artistIndex: this.state.selectedImage.artistIndex, imageIndex: this.state.selectedImage.imageIndex })}
            nextSrc={this.getImageSrc(this.getNextImage())}
            prevSrc={this.getImageSrc(this.getPrevImage())}
            onMovePrevRequest={() => this.gotoLightboxImage(this.getPrevImage())}
            onMoveNextRequest={() => this.gotoLightboxImage(this.getNextImage())}
            imageCaption={this.state.artistMedia[this.state.selectedImage.artistIndex].title}
            onCloseRequest={() => this.setState({ lightboxOpen: false })}
          />
        }
      </Layout>
    )
  }
}

export default GigTemplate

export const pageQuery = graphql`
  query GigsBySlug($slug: String!, $artists: [String]!, $venue: String!, $gigDir: String! ) {
    site {
      siteMetadata {
        title
        author
      }
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        machine_name
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        venue
        artists { name, vid {link, title} }
        cover {
          childImageSharp {
            fluid(maxWidth: 1600) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    images: allFile( filter: {extension: {in: ["jpg", "JPG"]}, fields: { gigDir: {eq: $gigDir}}}) {
      group(field: fields___artist) {
        fieldValue
        edges {
          node {
            name
            publicURL
            childImageSharp {
              fluid(maxWidth: 1600) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    audio: allFile( filter: {extension: {in: ["mp3", "json"]}, fields: { gigDir: {eq: $gigDir}}}) {
      group(field: fields___artist) {
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
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
