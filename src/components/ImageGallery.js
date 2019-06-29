import React, { useState } from 'react'
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

export default ({images, gridSize, title, imageCaption}) => {

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const openLightbox = (imageIndex, event) => {
    event.preventDefault()
    gotoLightboxImage(imageIndex)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const gotoLightboxImage = (imageIndex) => {
    setLightboxOpen(true)
    setSelectedImage(imageIndex)
  }

  const getNextImage = () => {
    const currentImageIndex = selectedImage

    if (currentImageIndex < images.length - 1) {
      return currentImageIndex + 1
    }
    return false
  }

  const getPrevImage = () => {
    const currentImageIndex = selectedImage

    if (currentImageIndex != 0) {
      return currentImageIndex - 1
    }
    return false
  }

  const getImageSrc = (imageIndex, size) => {
    if (imageIndex !== false && images[imageIndex]) {
      switch(size) {
        default:
          const parsed_srcset = parse(images[imageIndex].node.childImageSharp.fluid.srcSet)
          return parsed_srcset.find(image => image.width == 1600).url
        case "full":
          return images[imageIndex].node.publicURL
      }
    }
  }

  const imageElements = images && images.map(({node}, imageIndex) => {
    return (
      <a style={{cursor: "pointer", display: "block", width: "100%", height: "100%"}} key={imageIndex} onClick={e => openLightbox(imageIndex, e)}>
        <Img fluid={{...node.childImageSharp.fluid, sizes: gridToSizes(gridSize)}} />
      </a>
    )
  })

  return (
    <>
      <FlexGridContainer {...gridSize} maxWidth="600px">
        {imageElements}
      </FlexGridContainer>
      {lightboxOpen &&
        <Lightbox
          mainSrc={getImageSrc(selectedImage)}
          nextSrc={getImageSrc(getNextImage())}
          prevSrc={getImageSrc(getPrevImage())}
          onMovePrevRequest={() => gotoLightboxImage(getPrevImage())}
          onMoveNextRequest={() => gotoLightboxImage(getNextImage())}
          toolbarButtons={
            [
              <LightBoxToolbarButton title="Download" target="_blank" href={getImageSrc(selectedImage, "full")}>
                <MdFileDownload/>
              </LightBoxToolbarButton>
            ]
          }
          imageTitle={title}
          imageCaption={imageCaption}
          onCloseRequest={closeLightbox}
        />
      }
    </>
  )
}
