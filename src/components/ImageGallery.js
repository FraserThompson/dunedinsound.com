import React from 'react'
import styled from '@emotion/styled'
import Img from 'gatsby-image'
import Lightbox from 'react-image-lightbox'
import { gridToSizes } from  '../utils/helper'
import { MdFileDownload } from 'react-icons/md'
import FlexGridContainer from '../components/FlexGridContainer'
import { parse } from 'srcset'

const LightBoxToolbarButton = styled.a`
  color: #ccc;
  width: 40px;
  height: 35px;
  cursor: pointer;
  border: none;
  position: relative;
  padding-right: 10px;
  top: 5px;
`

class ImageGallery extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lightboxOpen: false,
      selectedImage: 0
    }
  }

  openLightbox = (imageIndex, event) => {
    event.preventDefault()
    this.gotoLightboxImage(imageIndex)
    this.setState({ lightboxOpen: true })
  }

  closeLightbox = () => {
    this.setState({ lightboxOpen: false })
  }

  gotoLightboxImage = (imageIndex) => {
    this.setState({ lightboxOpen: true, selectedImage: imageIndex })
  }

  getNextImage = () => {
    const currentImageIndex = this.state.selectedImage

    if (currentImageIndex < this.props.images.length - 1) {
      return currentImageIndex + 1
    }
    return false
  }

  getPrevImage = () => {
    const currentImageIndex = this.state.selectedImage

    if (currentImageIndex != 0) {
      return currentImageIndex - 1
    }
    return false
  }

  getImageSrc = (imageIndex, size) => {
    if (imageIndex !== false && this.props.images[imageIndex]) {
      switch(size) {
        default:
          const parsed_srcset = parse(this.props.images[imageIndex].node.childImageSharp.fluid.srcSet)
          return parsed_srcset.find(image => image.width == 1200).url
        case "full":
          return this.props.images[imageIndex].node.publicURL
        case "thumbnail":
          return this.props.images[imageIndex].node.childImageSharp.fluid.src;
      }
    }
  }

  render() {

    const imageElements = this.props.images && this.props.images.map(({node}, imageIndex) => {
      return (
        <a style={{cursor: "pointer", display: "block", width: "100%", height: "100%"}} key={imageIndex} onClick={e => this.openLightbox(imageIndex, e)}>
          <Img fluid={{...node.childImageSharp.fluid, sizes: gridToSizes(this.props.gridSize)}} />
        </a>
      )
    })

    return (
      <>
        <FlexGridContainer {...this.props.gridSize} maxWidth="600px">
          {imageElements}
        </FlexGridContainer>
        {this.state.lightboxOpen &&
          <Lightbox
            mainSrc={this.getImageSrc(this.state.selectedImage)}
            mainSrcThumbnail={this.getImageSrc(this.state.selectedImage, "thumbnail")}
            nextSrc={this.getImageSrc(this.getNextImage())}
            nextSrcThumbnail={this.getImageSrc(this.getNextImage(), "thumbnail")}
            prevSrc={this.getImageSrc(this.getPrevImage())}
            prevSrcThumbnail={this.getImageSrc(this.getPrevImage(), "thumbnail")}
            onMovePrevRequest={() => this.gotoLightboxImage(this.getPrevImage())}
            onMoveNextRequest={() => this.gotoLightboxImage(this.getNextImage())}
            toolbarButtons={
              [
                <LightBoxToolbarButton title="Download" target="_blank" href={this.getImageSrc(this.state.selectedImage, "full")}>
                  <MdFileDownload/>
                </LightBoxToolbarButton>
              ]
            }
            imageTitle={this.props.title}
            imageCaption={this.props.imageCaption}
            onCloseRequest={this.closeLightbox}
          />
        }
      </>
    )

  }
}

export default ImageGallery
