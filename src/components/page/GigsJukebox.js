import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import YouTubeResponsive from '../YouTubeResponsive'
import { AudioWrapper, PlayerWrapper, Titlebar, ToggleButton, TracklistWrapper, Transport, TransportButton } from '../Winamp'
import { rhythm } from '../../utils/typography'
import CloudBackground from '../CloudBackground'
import { getRandom, graphqlGroupToObject } from '../../utils/helper'
import { Link } from 'gatsby'
import Player from '../Player'
import { shuffler } from '../../utils/shuffling'

export const GigsJukebox = React.memo(({ data }) => {
  const [mode, setMode] = useState('video')
  const [timeTravelIndex, setTimeTravelIndex] = useState(0)

  const [wavesurfer, setWaveSurfer] = useState(null)

  const audioByGig = useMemo(() => graphqlGroupToObject(data.audio.group), [data.audio])
  const artistsByTitle = useMemo(() => graphqlGroupToObject(data.artists.group), [data.artists])
  const venuesById = useMemo(() => graphqlGroupToObject(data.venues.group), [data.venues])

  // Get the audio from an artist
  const getAudio = useCallback(
    (gig, artist) => {
      if (!artist || !gig) return
      const gigAudio = audioByGig[gig.fields.fileName]
      if (gigAudio) {
        const gigAudioObj = gigAudio.reduce(
          (acc, thing) => {
            const machineName = thing.relativeDirectory.split('/')[2]
            if (machineName === artist.fields.fileName) {
              if (thing.ext === '.mp3') {
                acc['audio'][0]['.mp3'] = thing
              } else {
                acc['audio'][0]['.json'] = thing
              }
            }
            return acc
          },
          { title: artist.title, audio: [{ '.mp3': null, '.json': null }] }
        )
        return gigAudioObj && gigAudioObj.audio[0]['.mp3'] && gigAudioObj
      }
    },
    [audioByGig]
  )

  // Shuffled gigs and artists and media
  const shuffledGigs = useMemo(
    () =>
      shuffler(
        data.gigs.nodes.reduce((acc, gig) => {
          // We only want artists with audio and video
          const withVids = gig.artists.filter((artist) => artist.vid)

          if (!withVids) return acc

          let enrichedArtists = withVids.map((gigArtist) => {
            const artistEntity = artistsByTitle[gigArtist.name] ? artistsByTitle[gigArtist.name][0] : null
            const audio = artistEntity && getAudio(gig, artistEntity)
            return { ...gigArtist, audio, artistEntity }
          })

          enrichedArtists = enrichedArtists.filter((artist) => artist.audio)

          if (!enrichedArtists.length) return acc

          const gigArtist = enrichedArtists[getRandom(0, enrichedArtists.length)]
          const vid = gigArtist.vid[getRandom(0, gigArtist.vid.length)].link
          const audio = gigArtist.audio
          const artist = gigArtist.artistEntity
          const venue = venuesById[gig.venue] ? venuesById[gig.venue][0] : null

          return [...acc, { ...gig, artist, venue, vid, audio }]
        }, [])
      ),
    [data.gigs, venuesById, artistsByTitle]
  )

  return (
    <ContentWrapper>
      <GigsPlayerWrapper>
        <PlayerWrapper className="player">
          <GigsTitlebar></GigsTitlebar>
          <AudioWrapper>
            {mode === 'video' && shuffledGigs[timeTravelIndex] && <YouTubeResponsive videoId={shuffledGigs[timeTravelIndex].vid} vanilla={true} />}
            {mode === 'audio' && shuffledGigs[timeTravelIndex] && shuffledGigs[timeTravelIndex].audio && (
              <Player artistAudio={[shuffledGigs[timeTravelIndex].audio]} barebones={true} playOnLoad={true} setWaveSurferCallback={setWaveSurfer} />
            )}
          </AudioWrapper>
          <Transport>
            <TransportButton className="buttonStyle left" disabled={timeTravelIndex - 1 < 0} onClick={(e) => setTimeTravelIndex(timeTravelIndex - 1)} />
            <TransportButton disabled={mode === 'video' ? true : false} className="buttonStyle play" onClick={(e) => wavesurfer && wavesurfer.play()} />
            <TransportButton disabled={mode === 'video' ? true : false} className="buttonStyle pause" onClick={(e) => wavesurfer && wavesurfer.pause()} />
            <TransportButton className="buttonStyle right" onClick={(e) => setTimeTravelIndex(timeTravelIndex + 1)} />
            <div style={{ float: 'right' }}>
              <ToggleButton className={mode === 'video' ? 'active' : ''} onClick={() => setMode('video')} style={{ paddingLeft: '5px' }}>
                Video
              </ToggleButton>
              {shuffledGigs[timeTravelIndex]?.audio && (
                <ToggleButton className={mode === 'audio' ? 'active' : ''} onClick={() => setMode('audio')}>
                  Audio
                </ToggleButton>
              )}
            </div>
          </Transport>
          <TracklistWrapper>
            {shuffledGigs[timeTravelIndex] && (
              <ul className="tracklist">
                <li className="title noHover">
                  Gig: {shuffledGigs[timeTravelIndex].title}{' '}
                  <Link to={shuffledGigs[timeTravelIndex].fields.slug} title="Gig page" target="_blank">
                    (Go to gig)
                  </Link>
                </li>
                <li className="title noHover">Date: {shuffledGigs[timeTravelIndex].date}</li>
                <li className="title noHover">
                  Artist: {shuffledGigs[timeTravelIndex].artist?.title || 'Unknown'}{' '}
                  {shuffledGigs[timeTravelIndex].artist?.bandcamp && (
                    <a target="_blank" href={shuffledGigs[timeTravelIndex].artist.bandcamp}>
                      (Bandcamp)
                    </a>
                  )}
                </li>
                <li className="title noHover">Venue: {shuffledGigs[timeTravelIndex].venue?.title || 'Unknown'}</li>
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

  .player {
    width: 100%;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    margin-top: ${(props) => `calc(${props.theme.headerHeight} + ${props.theme.subheaderHeight})`};
    height: ${(props) => `calc(100vh - ${props.theme.headerHeight} - ${props.theme.subheaderHeight})`};
  }
`

const GigsPlayerWrapper = styled.div`
  z-index: 2;
  position: relative;
  margin: 0 auto;
  padding: ${rhythm(0.5)};
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
  box-shadow: 0px -150px 1000px white;
  bottom: 0;
  height: 200px;
  width: 100vw;
  margin-top: auto;
`
