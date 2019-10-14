import React from 'react'
import ImageGallery from '../../components/ImageGallery'
import GridContainer from '../../components/GridContainer'
import Divider from '../../components/Divider'
import YouTubeResponsive from '../../components/YouTubeResponsive'
import { rhythm } from '../../utils/typography'
import LoadingSpinner from '../../components/LoadingSpinner'
import DropdownMenu from '../../components/DropdownMenu'
import { scrollTo } from '../../utils/helper'

export default React.memo(({ artistMedia, gigTitle }) => {
  const media = artistMedia.map(artist => {
    const gridSize = {
      xs: '12',
      sm: '4',
      md: '3',
      lg: artist.images && artist.images.length <= 6 ? '4' : artist.images && artist.images.length <= 16 ? '3' : '2',
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

    return (
      <div key={artist.machineName} id={artist.machineName}>
        <Divider sticky={true}>
          <DropdownMenu
            height={rhythm(1)}
            list={artistMedia.filter(item => item.machineName != artist.machineName)}
            direction="down"
            selectCallback={(e, item) => scrollTo(e, item.machineName)}
            fullWidthMobile={true}
          >
            <p style={{ marginRight: rhythm(0.5), textAlign: 'center', width: '100%' }}>{artist.title}</p>
          </DropdownMenu>
        </Divider>
        <GridContainer xs="12" sm="6" md="6" lg="6">
          {vidElements}
        </GridContainer>
        <ImageGallery
          artist={artist.machineName}
          gridSize={gridSize}
          images={artist.images}
          title={gigTitle}
          imageCaption={
            <>
              {artist.title}
              {artist.details && (
                <a href={artist.details.fields.slug} target="_blank" title="Go to artist page">
                  {' '}
                  More media from this artist
                </a>
              )}
            </>
          }
        />
      </div>
    )
  })
  return artistMedia.length > 0 ? (
    media
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoadingSpinner />
    </div>
  )
})
