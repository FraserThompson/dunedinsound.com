import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import YouTubeResponsive from '../YouTubeResponsive'
import { AudioWrapper, PlayerWrapper, Titlebar, TracklistWrapper, TransportButton } from '../Winamp'
import { FaBackward, FaForward } from 'react-icons/fa'
import { rhythm } from '../../utils/typography'
import CloudBackground from '../CloudBackground'
import { getRandom } from '../../utils/helper'
import { Link } from 'gatsby'

export const GigsJukebox = React.memo(({ data }) => {
  const [gigHistory, setGigHistory] = useState([])
  const [timeTravelIndex, setTimeTravelIndex] = useState(0)

  const [currentGig, setCurrentGig] = useState(null)

  const flatGigs = useMemo(() => data.gigsByDate.group.reduce((acc, group) => [...acc, ...group.nodes], []), [])

  // Click callbacks
  const nextGig = useCallback(() => {
    if (timeTravelIndex < 0) {
      // If we're currently going back in time
      const newTimeTravelIndex = timeTravelIndex + 1
      setTimeTravelIndex(newTimeTravelIndex)
      setCurrentGig(gigHistory[gigHistory.length - 1 + newTimeTravelIndex])
    } else {
      // Otherwise roll the die
      const newGig = rollTheDie()
      setGigHistory([...gigHistory, newGig])
      setCurrentGig(newGig)
    }
  }, [currentGig, gigHistory, timeTravelIndex])

  const prevGig = useCallback(() => {
    const newTimeTravelIndex = timeTravelIndex - 1
    setTimeTravelIndex(newTimeTravelIndex)
    setCurrentGig(gigHistory[gigHistory.length - 1 + newTimeTravelIndex])
  }, [gigHistory, timeTravelIndex])

  // Data processors
  const getGig = useCallback(() => {
    const randomNumber = getRandom(0, flatGigs.length)
    return flatGigs[randomNumber]
  }, [flatGigs])

  const getArtist = useCallback((gig) => {
    if (!gig) return
    const artistsWithVids = gig.artists.filter((artist) => artist.vid)
    const randomNumber = getRandom(0, artistsWithVids.length)
    return artistsWithVids[randomNumber]
  }, [])

  const getVideo = useCallback((artist) => {
    if (!artist) return
    const randomNumber = getRandom(0, artist.vid.length)
    return artist.vid[randomNumber].link
  }, [])

  // This one does it all
  const rollTheDie = useCallback(() => {
    const gig = getGig()
    const artist = getArtist(gig)
    const vid = getVideo(artist)
    return { gig, artist, vid }
  }, [getGig, getArtist, getVideo])

  // And this one kicks things off
  useEffect(() => {
    const thing = rollTheDie()
    setCurrentGig(thing)
    setGigHistory([...gigHistory, thing])
  }, [])

  return (
    <ContentWrapper>
      <GigsPlayerWrapper>
        <PlayerWrapper className="player">
          <GigsTitlebar></GigsTitlebar>
          <AudioWrapper>
            <TransportButton disabled={!gigHistory[gigHistory.length - 1 + (timeTravelIndex - 1)]} onClick={(e) => prevGig()}>
              <FaBackward />
            </TransportButton>
            {currentGig && <YouTubeResponsive videoId={currentGig.vid} vanilla={true} />}
            <TransportButton onClick={(e) => nextGig()}>
              <FaForward />
            </TransportButton>
          </AudioWrapper>
          <TracklistWrapper>
            {currentGig && (
              <ul className="tracklist">
                <li className="title">
                  Gig: <Link to={currentGig.gig.fields.slug}>{currentGig.gig.title}</Link>
                </li>
                <li className="title">Artist: {currentGig.artist.name}</li>
                <li className="title">Date: {currentGig.gig.date}</li>
              </ul>
            )}
          </TracklistWrapper>
        </PlayerWrapper>
      </GigsPlayerWrapper>
      <CloudBackground></CloudBackground>
      <Bottom></Bottom>
    </ContentWrapper>
  )
})

const ContentWrapper = styled.div`
  margin-top: ${(props) => `calc(${props.theme.subheaderHeight})`};

  overflow: hidden;
  background-color: lightblue;
  width: 100%;
  height: ${(props) => `calc(100vh - ${props.theme.headerHeightMobile})`};
  position: relative;

  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    margin-top: ${(props) => `calc(${props.theme.headerHeight} + ${props.theme.subheaderHeight})`};
    height: ${(props) => `calc(100vh - ${props.theme.headerHeight} - ${props.theme.subheaderHeight})`};
  }
`

const GigsPlayerWrapper = styled.div`
  z-index: 2;
  position: relative;
  margin: 0 auto;
  padding: ${rhythm(1)};
  padding-top: 50px;
  max-width: 1200px;
  width: 100%;
`

const GigsTitlebar = styled(Titlebar)`
  &::after {
    content: 'GIG JUKEBOX';
  }
`

const Bottom = styled.div`
  background-color: green;
  bottom: 0;
  height: 200px;
  width: 100vw;
  margin-top: auto;
`
