import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { GatsbyImage, getImage, getSrcSet } from 'gatsby-plugin-image'
import Lightbox from 'react-image-lightbox'
import { FaDownload } from 'react-icons/fa'
import FlexGridContainer from '../components/FlexGridContainer'
import { createBrowserHistory } from 'history'
import { parseSrcset } from 'srcset'

export default React.memo(({ images, gridSize, title, imageCaption }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [directLinked, setDirectLinked] = useState(false)

  const history = typeof window !== 'undefined' && createBrowserHistory()

  useEffect(() => {
    handleURLChange(history.location)
    const unlisten = history.listen((location) => handleURLChange(location.location))
    return () => unlisten()
  })

  const handleURLChange = (location) => {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search)
      if (!location.state || !location.state.lightboxOpen) setDirectLinked(true) // this won't be set if we come direct to the url
      setSelectedImage(parseInt(searchParams.get('image')))
      setLightboxOpen(true)
    } else {
      setLightboxOpen(false)
    }
  }

  const openLightbox = (imageIndex, event) => {
    event.preventDefault()
    history.push({
      pathname: history.location.pathname,
      search: `?image=${imageIndex}`,
      state: { lightboxOpen: true },
    })
  }

  const closeLightbox = () => (!directLinked ? history.goBack() : history.replace({ pathname: history.location.pathname, search: '' }))

  const gotoLightboxImage = (imageIndex) =>
    history.replace({
      pathname: history.location.pathname,
      search: `?image=${imageIndex}`,
      state: { lightboxOpen: true },
    })

  const nextImage = selectedImage < images.length - 1 ? selectedImage + 1 : false

  const prevImage = selectedImage != 0 ? selectedImage - 1 : false

  const getImageSrc = (imageIndex, size) => {
    if (imageIndex !== false && images[imageIndex]) {
      switch (size) {
        default:
          const srcSet = getSrcSet(images[imageIndex].node)
          return parseSrcset(srcSet).find((thing) => thing.width === 1600 || thing.width === 800).url
        case 'full':
          return images[imageIndex].node.publicURL
      }
    }
  }

  const imageElements =
    images &&
    images.map(({ node }, imageIndex) => (
      <a style={{ cursor: 'pointer', display: 'block', height: '100%', width: '400px' }} key={imageIndex} onClick={(e) => openLightbox(imageIndex, e)}>
        <GatsbyImage image={getImage(node)} alt="" />
      </a>
    ))

  return (
    <>
      <FlexGridContainer {...gridSize} maxWidth="600px">
        {imageElements}
      </FlexGridContainer>
      {lightboxOpen && (
        <Lightbox
          mainSrc={getImageSrc(selectedImage)}
          nextSrc={getImageSrc(nextImage)}
          prevSrc={getImageSrc(prevImage)}
          onMovePrevRequest={() => gotoLightboxImage(prevImage)}
          onMoveNextRequest={() => gotoLightboxImage(nextImage)}
          toolbarButtons={[
            <LightBoxToolbarButton title="Download" target="_blank" href={getImageSrc(selectedImage, 'full')}>
              <FaDownload />
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
