import React, { useEffect, useState } from 'react'
import { getSrcSet } from 'gatsby-plugin-image'
import Lightbox from 'react-18-image-lightbox'
import { FaDownload } from 'react-icons/fa'
import { scrollTo } from '../../utils/helper'
import styled from '@emotion/styled'
import { parseSrcset } from 'srcset'

export default React.memo(({ gigTitle, artistMedia, history }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [directLinked, setDirectLinked] = useState(false)

  useEffect(() => {
    if (history.location.hash) {
      scrollTo(null, decodeURIComponent(history.location.hash.substring(1)))
    }
    handleURLChange(history.location)
    const unlisten = history.listen((location) => handleURLChange(location.location))
    return () => unlisten()
  }, [])

  useEffect(() => {
    selectedArtist && scrollTo(null, selectedArtist.machineName)
  }, [selectedArtist])

  const handleURLChange = (location) => {
    const directLinked = !location.state && location.search && location.hash
    if (directLinked) setDirectLinked(true)

    if (directLinked || (location.state?.lightboxOpen && location.hash && location.search)) {
      const newSelectedArtistId = decodeURIComponent(location.hash.substring(1))
      const newSelectedArtist = artistMedia.find((artist) => artist.machineName == newSelectedArtistId)

      setSelectedArtist(newSelectedArtist)

      // Only open the lightbox if we validated its a real artist
      if (location.search && newSelectedArtist) {
        const searchParams = new URLSearchParams(location.search)
        const newSelectedImage = parseInt(searchParams.get('image'))
        setSelectedImage(newSelectedImage)
        setLightboxOpen(true)
      }
    } else {
      setLightboxOpen(false)
    }
  }

  // If someone is already on the site we can use the back button, otherwise it'd send them to where they came from
  const closeLightbox = () => (!directLinked ? history.back() : history.replace({ hash: '#' + selectedArtist.machineName, search: '' }))

  // Goes to the image by updating the URL
  const gotoLightboxImage = ({ selectedImage, selectedArtist }) => {
    history.replace(
      {
        hash: '#' + selectedArtist.machineName,
        search: `?image=${selectedImage}`,
      },
      { lightboxOpen: true }
    )
  }

  // Finds the index of the next image (could be on the next artist)
  const nextImage = () => {
    let newSelectedImage = false
    let newSelectedArtist = false

    if (selectedArtist && selectedImage < selectedArtist.images.length - 1) {
      newSelectedImage = selectedImage + 1
      newSelectedArtist = selectedArtist
    } else if (selectedArtist && selectedArtist.index < artistMedia.length - 1) {
      newSelectedImage = 0
      newSelectedArtist = artistMedia[selectedArtist.index + 1]
    }

    return { selectedArtist: newSelectedArtist, selectedImage: newSelectedImage }
  }

  // Finds the index of the previous image (could be on the previous artist)
  const prevImage = () => {
    let newSelectedImage = false
    let newSelectedArtist = false

    if (selectedArtist && selectedImage != 0) {
      newSelectedImage = selectedImage - 1
      newSelectedArtist = selectedArtist
    } else if (selectedArtist && selectedArtist.index > 0) {
      newSelectedArtist = artistMedia[selectedArtist.index - 1]
      newSelectedImage = newSelectedArtist.images.length - 1
    }

    return { selectedArtist: newSelectedArtist, selectedImage: newSelectedImage }
  }

  // Gets the src of an image based on its location in our array of media
  const getImageSrc = ({ selectedImage, selectedArtist }, size) => {
    if (selectedArtist && selectedImage !== false) {
      const images = selectedArtist.images
      switch (size) {
        default:
          const srcSet = getSrcSet(images[selectedImage])
          const parsed = parseSrcset(srcSet)

          // The last image is always the largest, so just return that.
          // Usually 1600 wide, very rarely 800.
          const displayed_image = parsed[parsed.length - 1]

          return displayed_image.url

        case 'full':
          return images[selectedImage].publicURL
      }
    }
  }

  const lightboxCaption = selectedArtist && (
    <>
      {selectedArtist.title}
      {selectedArtist.details && (
        <>
          {' '}
          ●{' '}
          <a href={selectedArtist.details.fields.slug} title="Go to artist page">
            More gigs featuring this artist
          </a>
        </>
      )}
    </>
  )

  return lightboxOpen ? (
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
  ) : (
    <></>
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
