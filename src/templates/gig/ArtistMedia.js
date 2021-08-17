import React, { useEffect, useState } from 'react'
import { GatsbyImage, getImage, getSrcSet } from 'gatsby-plugin-image'
import GridContainer from '../../components/GridContainer'
import Divider from '../../components/Divider'
import Lightbox from 'react-image-lightbox'
import { FaDownload } from 'react-icons/fa'
import YouTubeResponsive from '../../components/YouTubeResponsive'
import { rhythm } from '../../utils/typography'
import FlexGridContainer from '../../components/FlexGridContainer'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArtistDropdownMenu from './ArtistDropdownMenu'
import { scrollTo } from '../../utils/helper'
import { createBrowserHistory } from 'history'
import styled from '@emotion/styled'
import { parse } from 'srcset'
import { Link } from 'gatsby'

export default React.memo(({ artistMedia, gigTitle }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
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

      const newSelectedArtist = parseInt(searchParams.get('artist'))
      const newSelectedImage = parseInt(searchParams.get('image'))

      // If we've moved to a new artist scroll to it so they're not confused when they close it
      if (newSelectedArtist != selectedArtist && artistMedia[newSelectedArtist]) {
        scrollTo(null, artistMedia[newSelectedArtist].machineName)
      }

      setSelectedArtist(newSelectedArtist)
      setSelectedImage(newSelectedImage)
      setLightboxOpen(true)
    } else {
      setLightboxOpen(false)
    }
  }

  const closeLightbox = () => (!directLinked ? history.goBack() : history.replace({ pathname: history.location.pathname, search: '' }))

  // Goes to the image by updating the URL
  const gotoLightboxImage = ({ selectedImage, selectedArtist }) =>
    history.replace({
      pathname: history.location.pathname,
      search: `?image=${selectedImage}&artist=${selectedArtist}`,
      state: { lightboxOpen: true },
    })

  // Finds the index of the next image (could be on the next artist)
  const nextImage = () => {
    let newSelectedImage = false
    let newSelectedArtist = false

    if (selectedImage < artistMedia[selectedArtist].images.length - 1) {
      newSelectedImage = selectedImage + 1
      newSelectedArtist = selectedArtist
    } else if (selectedArtist < artistMedia.length - 1) {
      newSelectedImage = 0
      newSelectedArtist = selectedArtist + 1
    }

    return { selectedArtist: newSelectedArtist, selectedImage: newSelectedImage }
  }

  // Finds the index of the previous image (could be on the previous artist)
  const prevImage = () => {
    let newSelectedImage = false
    let newSelectedArtist = false

    if (selectedImage != 0) {
      newSelectedImage = selectedImage - 1
      newSelectedArtist = selectedArtist
    } else if (selectedArtist > 0) {
      newSelectedArtist = selectedArtist - 1
      newSelectedImage = artistMedia[newSelectedArtist].images.length - 1
    }

    return { selectedArtist: newSelectedArtist, selectedImage: newSelectedImage }
  }

  // Gets the src of an image based on its location in our array of media
  const getImageSrc = ({ selectedImage, selectedArtist }, size) => {
    if (selectedArtist !== false && selectedImage !== false) {
      const images = artistMedia[selectedArtist]['images']
      switch (size) {
        default:
          const srcSet = getSrcSet(images[selectedImage].node)
          return parse(srcSet).find((thing) => thing.width === 1600).url
        case 'full':
          return images[selectedImage].node.publicURL
      }
    }
  }

  const lightboxCaption = artistMedia[selectedArtist] && (
    <>
      {artistMedia[selectedArtist].title}
      {artistMedia[selectedArtist].details && (
        <>
          {' '}
          ●{' '}
          <a href={artistMedia[selectedArtist].details.fields.slug} title="Go to artist page">
            More media from this artist
          </a>
        </>
      )}
    </>
  )

  // Maps all media from an artist into an array of dividers, images, and videos
  const media = artistMedia.map((artist, artistIndex) => {
    const images = artist.images

    const gridSize = {
      xs: '12',
      sm: '4',
      md: '3',
      lg: images && images.length <= 6 ? '4' : images && images.length <= 16 ? '3' : '2',
    }

    const vidElements =
      artist.vid &&
      artist.vid.map((video, vidIndex) => (
        <YouTubeResponsive
          key={video.link}
          videoId={video.link}
          key={video.link}
          odd={artist.vid.length % 2 !== 0 && vidIndex === artist.vid.length - 1 ? true : false}
        />
      ))

    const openLightbox = (imageIndex, event) => {
      event.preventDefault()
      history.push({
        pathname: history.location.pathname,
        search: `?image=${imageIndex}&artist=${artistIndex}`,
        state: { lightboxOpen: true },
      })
    }

    const imageElements =
      images &&
      images.map(({ node }, imageIndex) => (
        <a style={{ cursor: 'pointer', display: 'block', height: '100%', width: '400px' }} key={imageIndex} onClick={(e) => openLightbox(imageIndex, e)}>
          <GatsbyImage image={getImage(node)} alt="" />
        </a>
      ))

    return (
      <div key={artist.machineName} id={artist.machineName}>
        <Divider sticky={'header'}>
          <p style={{ marginRight: rhythm(0.5), textAlign: 'center', width: '100%' }}>{artist.title}</p>
        </Divider>
        <GridContainer xs="12" sm="6" md="6" lg="6">
          {vidElements}
        </GridContainer>
        <FlexGridContainer {...gridSize} maxWidth="600px">
          {imageElements}
        </FlexGridContainer>
      </div>
    )
  })

  return artistMedia.length > 0 ? (
    <>
      {artistMedia.length > 1 && (
        <ArtistDropdownMenu
          height={rhythm(1)}
          selected={artistMedia.findIndex((item) => item.machineName == '')}
          list={artistMedia}
          direction="down"
          selectCallback={(e, item) => scrollTo(e, item.machineName)}
          fullWidthMobile={true}
        />
      )}
      {media}
      {lightboxOpen && (
        <Lightbox
          mainSrc={getImageSrc({ selectedImage, selectedArtist })}
          nextSrc={getImageSrc(nextImage())}
          prevSrc={getImageSrc(prevImage())}
          onMoveNextRequest={() => gotoLightboxImage(nextImage())}
          onMovePrevRequest={() => gotoLightboxImage(prevImage())}
          toolbarButtons={[
            <LightBoxToolbarButton title="Download" target="_blank" href={getImageSrc({ selectedImage, selectedArtist }, 'full')}>
              <FaDownload />
            </LightBoxToolbarButton>,
          ]}
          imageTitle={gigTitle}
          imageCaption={lightboxCaption}
          onCloseRequest={closeLightbox}
        />
      )}
    </>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoadingSpinner />
    </div>
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
