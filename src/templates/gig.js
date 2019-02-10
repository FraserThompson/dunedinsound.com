import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import styled from "styled-components"
import Img from 'gatsby-image'
import Lightbox from 'react-image-lightbox';
import Layout from '../components/Layout'
import GridContainer from '../components/GridContainer';
import BackgroundImage from '../components/BackgroundImage';
import { rhythm } from '../utils/typography';
import Banner from '../components/Banner';
import Divider from '../components/Divider';

class GigTemplate extends React.Component {

  constructor(props) {
    super(props);

    const post = this.props.data.thisPost
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt

    // Turn the data returned from the images query into a key-value object of images
    const imagesByArtist = this.props.data.images['group'].reduce((obj, item) => {
      const machineName = item.fieldValue.match(/([^\\]*)\\*$/)[1]
      const images = item.edges.map(image => image.node.childImageSharp.fluid)
      obj[machineName] = images
      return obj
    }, {})

    // Turn the data returned from the artist query into a key-value object of details
    const detailsByArtist = this.props.data.artists['group'].reduce((obj, item) => {
      const machineName = item.edges[0].node.fields.machine_name
      const frontmatter = item.edges[0].node.frontmatter
      obj[machineName] = frontmatter
      return obj
    }, {})

    // Collect all the above into one array of artists with all their media
    const artistMedia = post.frontmatter.artists.map(artist => {
      console.log(artist);
      return {
        ...artist,
        title: detailsByArtist[artist.name].title,
        images: imagesByArtist[artist.name]
      }
    })

    const venueDetails = this.props.data.venue.edges[0].node

    this.state = {
      post,
      siteTitle,
      siteDescription,
      artistMedia,
      venueDetails,
      lightboxOpen: false,
      selectedImage: undefined
    }

  }

  openLightbox = (artistIndex, imageIndex, event) => {
    event.preventDefault()
    this.gotoLightboxImage({artistIndex, imageIndex})
  }

  gotoLightboxImage = ({artistIndex, imageIndex}) => {
    this.setState({ lightboxOpen: true, selectedImage: { artistIndex, imageIndex } })
  }

  getNextImage = () => {
    const currentArtistIndex = this.state.selectedImage.artistIndex;
    const currentImageIndex = this.state.selectedImage.imageIndex

    if ((currentImageIndex + 1) >= this.state.artistMedia[currentArtistIndex].images.length && (currentArtistIndex + 1) <= this.state.artistMedia.length){
      return {artistIndex: currentArtistIndex + 1, imageIndex: 0}
    } else {
      return {artistIndex: currentArtistIndex, imageIndex: currentImageIndex + 1}
    }
  }

  getPrevImage = () => {
    const currentArtistIndex = this.state.selectedImage.artistIndex;
    const currentImageIndex = this.state.selectedImage.imageIndex;

    if (currentImageIndex < 0 && currentArtistIndex > 0) {
      return {artistIndex: currentArtistIndex - 1, imageIndex: this.state.artistMedia[artistIndex - 1].images.length}
    } else {
      return {artistIndex: currentArtistIndex, imageIndex: currentImageIndex - 1}
    }
  }

  getImageSrc = ({artistIndex, imageIndex}) => {
    return this.state.artistMedia[artistIndex].images[imageIndex] && this.state.artistMedia[artistIndex].images[imageIndex].src;
  }

  render() {

    const { previous, next } = this.props.pageContext
    const HorizontalNav = styled.ul`
      background-color: transparent;
      width: auto;
      max-height: 40vh;
      overflow-y: auto;

      li {
        display: inline-block;
        line-height: 40px;
        a {
          text-decoration: none;
          color: #999;
          padding-right: 20px;
          padding-left: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    `

    const playlist = this.state.artistMedia.map((artist, index) => {
      return (
        <li key={index}>
          <a href={"#" + artist.name}>{artist.title}</a>
        </li>
      )
    })

    // Iterate over all the media and gather it
    const mediaByArtist = this.state.artistMedia.map((artist, artistIndex) => {

      const imageElements = artist.images.map((fluidImage, artistImageIndex) => {
        return <a key={artistImageIndex} href={fluidImage.src} onClick={e => this.openLightbox(artistIndex, artistImageIndex, e)}>
          <Img fluid={fluidImage} />
        </a>
        }
      )

      const vidElements = artist.vid.map(video => <div><p key={video.link}>{video.link}</p></div>)

      return (
        <div key={artistIndex}>
          <Divider sticky={true}>
            <p id={artist.name}>{artist.title}</p>
          </Divider>
          <GridContainer xs="12" sm="6" md="6" lg="6">
            {vidElements}
          </GridContainer>
          <GridContainer xs="12" sm="6" md="4" lg="4">
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
        <Divider highlight={1}>
          <Link to="/gigs">
            <p style={{marginBottom: 0}}>Back to gigs</p>
          </Link>
        </Divider>
        <Banner backgroundImage={this.state.post.fields.cover.childImageSharp.fluid}>
            <h1>{this.state.post.frontmatter.title}</h1>
            <HorizontalNav>{playlist}</HorizontalNav>
        </Banner>
        {mediaByArtist}
        {this.state.lightboxOpen &&
          <Lightbox
            mainSrc={this.getImageSrc({artistIndex: this.state.selectedImage.artistIndex, imageIndex: this.state.selectedImage.imageIndex})}
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
  query GigsBySlug($slug: String!, $gigImagesRegex: String!, $artists: [String]!, $venue: String! ) {
    site {
      siteMetadata {
        title
        author
      }
    }
    thisPost: markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        machine_name
        cover {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        venue
        artists { name, mp3 { title}, vid {link, title} }
      }
    }
    images: allFile(filter: { relativePath: { regex: $gigImagesRegex } }) {
      group(field: relativeDirectory) {
        fieldValue
        edges {
          node {
            name
            absolutePath
            relativeDirectory
            publicURL
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
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
