import React, { useCallback, useEffect, useRef } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import GridContainer from '../../components/GridContainer'
import Divider from '../../components/Divider'
import YouTubeResponsive from '../../components/YouTubeResponsive'
import { rhythm } from '../../utils/typography'
import FlexGridContainer from '../../components/FlexGridContainer'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArtistDropdownMenu from './ArtistDropdownMenu'
import { createBrowserHistory } from 'history'
import ArtistMediaLightbox from './ArtistMediaLightbox'

export default React.memo(({ artistMedia, gigTitle }) => {
  const history = useRef(typeof window !== 'undefined' && createBrowserHistory())

  // Add the intersectionObserver which highlights the artist they're on in the menu
  useEffect(() => {
    const artistElements = document.querySelectorAll('.artist')
    if (!artistElements.length) return

    const options = {
      rootMargin: '0px 0px -100%',
    }

    const callback = (entries) => {
      if (history.current.location.search) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          history.current.replace({
            hash: '#' + el.id,
          })
        } else {
          const bannerHeight = document.querySelector('.banner')?.clientHeight || 0
          if (window.pageYOffset < bannerHeight) {
            history.current.replace({
              hash: '',
            })
          }
        }
      })
    }

    const observer = new IntersectionObserver(callback, options)
    artistElements.forEach((el) => observer.observe(el))
  }, [artistMedia])

  // Maps all media from an artist into an array of dividers, images, and videos
  const media = artistMedia.map((artist) => {
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
      history.current.push(
        {
          hash: '#' + artist.machineName,
          search: `?image=${imageIndex}`,
        },
        { lightboxOpen: true }
      )
    }

    const imageElements =
      images &&
      images.map(({ node }, imageIndex) => (
        <a style={{ cursor: 'pointer', display: 'block', height: '100%', width: '400px' }} key={imageIndex} onClick={(e) => openLightbox(imageIndex, e)}>
          <GatsbyImage image={getImage(node)} alt="" />
        </a>
      ))

    return (
      <div key={artist.machineName} id={artist.machineName} className="artist">
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
      {artistMedia.length > 1 && <ArtistDropdownMenu history={history.current} height={rhythm(1)} list={artistMedia} />}
      {media}
      {<ArtistMediaLightbox imageTitle={gigTitle} artistMedia={artistMedia} history={history.current} />}
    </>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoadingSpinner />
    </div>
  )
})
