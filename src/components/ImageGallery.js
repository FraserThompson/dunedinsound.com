import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import Img from 'gatsby-image'
import Lightbox from 'react-image-lightbox'
import { gridToSizes } from '../utils/helper'
import { MdFileDownload } from 'react-icons/md'
import FlexGridContainer from '../components/FlexGridContainer'
import { parse } from 'srcset'
import { createBrowserHistory } from 'history'

export default React.memo(({ artist, images, gridSize, title, imageCaption }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [directLinked, setDirectLinked] = useState(false)

  const history = createBrowserHistory()

  useEffect(() => {
    handleURLChange(history.location)
    const unlisten = history.listen((location) => handleURLChange(location.location))
    return () => unlisten()
  })

  const handleURLChange = (location) => {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search)
      if (searchParams.get('artist') == artist) {
        if (!location.state || !location.state.lightboxOpen) setDirectLinked(true) // this won't be set if we come direct to the url
        setSelectedImage(parseInt(searchParams.get('image')))
        setLightboxOpen(true)
      }
    } else {
      setLightboxOpen(false)
    }
  }

  const openLightbox = (imageIndex, event) => {
    event.preventDefault()
    history.push({
      pathname: history.location.pathname,
      search: `?image=${imageIndex}&artist=${artist}`,
      state: { lightboxOpen: true },
    })
  }

  const closeLightbox = () => (!directLinked ? history.goBack() : history.replace({ pathname: history.location.pathname, search: '' }))

  const gotoLightboxImage = (imageIndex) =>
    history.replace({
      pathname: history.location.pathname,
      search: `?image=${imageIndex}&artist=${artist}`,
      state: { lightboxOpen: true },
    })

  const getNextImage = () => (selectedImage < images.length - 1 ? selectedImage + 1 : false)

  const getPrevImage = () => (selectedImage != 0 ? selectedImage - 1 : false)

  const getImageSrc = (imageIndex, size) => {
    if (imageIndex !== false && images[imageIndex]) {
      switch (size) {
        default:
          const parsed_srcset = parse(images[imageIndex].node.childImageSharp.fluid.srcSet)
          return parsed_srcset.find((image) => image.width == 1600).url
        case 'full':
          return images[imageIndex].node.publicURL
      }
    }
  }

  const imageElements =
    images &&
    images.map(({ node }, imageIndex) => {
      return node.childImageSharp ? (
        <a style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }} key={imageIndex} onClick={(e) => openLightbox(imageIndex, e)}>
          <Img fluid={{ ...node.childImageSharp.fluid, sizes: gridToSizes(gridSize) }} />
        </a>
      ) : (
        console.log('BROKEN IMAGE, SKIPPING', node)
      )
    })

  return (
    <>
      <FlexGridContainer {...gridSize} maxWidth="600px">
        {imageElements}
      </FlexGridContainer>
      {lightboxOpen && (
        <Lightbox
          mainSrc={getImageSrc(selectedImage)}
          nextSrc={getImageSrc(getNextImage())}
          prevSrc={getImageSrc(getPrevImage())}
          onMovePrevRequest={() => gotoLightboxImage(getPrevImage())}
          onMoveNextRequest={() => gotoLightboxImage(getNextImage())}
          toolbarButtons={[
            <LightBoxToolbarButton title="Download" target="_blank" href={getImageSrc(selectedImage, 'full')}>
              <MdFileDownload />
            </LightBoxToolbarButton>,
          ]}
          imageTitle={title}
          imageCaption={imageCaption}
          onCloseRequest={closeLightbox}
        />
      )}
    </>
  )
})

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
