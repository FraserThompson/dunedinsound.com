/*
* Player.js
* An audio player for playing media from one or more artists.
* Parameters:
*  - artistAudio: Media to be displayed. An array of artistMedia objects.
        title: name of artist (required)
        audio: array of audio (required)
          .mp3:
            publicURL: path to mp3 file
          .json:
            publicURL: path to mp3 file
            data: JSON data (optional, but required if no publicURL)
        tracklist: timestamped tracklist (optional)
*/

import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { FaPlayCircle, FaPauseCircle, FaBackward, FaForward, FaDownload } from 'react-icons/fa'
import { theme } from '../utils/theme'
import RoundButton from './RoundButton'
import { scale } from '../utils/typography'
import LoadingSpinner from './LoadingSpinner'
import { timeToSeconds } from '../utils/helper'
import Menu from './Menu'
import { lighten, darken } from 'polished'

export default React.memo(({ artistAudio }) => {
  const waveformRef = useRef()

  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(undefined)
  const [duration, setDuration] = useState(undefined)
  const [selectedArtist, setSelectedArtist] = useState(0)
  const [queuePlay, setQueuePlay] = useState(false)
  const [queueSeek, setQueueSeek] = useState(false)

  const [wavesurfer, setWaveSurfer] = useState(undefined)

  // Create instance on mount
  useEffect(() => {
    window.cached_json = window.cached_json || {}

    // because otherwise window is not defined
    const WavesurferJS = require('wavesurfer.js')
    const RegionsPlugin = require('wavesurfer.js/dist/plugin/wavesurfer.regions')

    setWaveSurfer(
      WavesurferJS.create({
        container: waveformRef.current,
        waveColor: theme.default.waveformColor,
        height: 60,
        hideScrollbar: true,
        normalize: true,
        responsive: true,
        backend: 'MediaElement',
        pixelRatio: '1',
        forceDecode: false,
        progressColor: theme.default.waveformProgressColor,
        barWidth: '2',
        plugins: [RegionsPlugin.create()],
      })
    )
  }, [])

  // Attach callbacks when we have the instance
  useEffect(() => {
    if (!wavesurfer) return
    wavesurfer.on('ready', () => setReady(true))
    wavesurfer.on('finish', () => next())
    wavesurfer.on('play', () => setPlaying(true))
    wavesurfer.on('pause', () => setPlaying(false))
    wavesurfer.on('seek', () => setCurrentTime(wavesurfer.getCurrentTime()))
    wavesurfer.on('audioprocess', () => setCurrentTime(wavesurfer.getCurrentTime()))
    return () => wavesurfer && wavesurfer.destroy()
  }, [wavesurfer])

  // Update UI when ready
  useEffect(() => {
    if (!wavesurfer) return

    // So other components can respond to Wavesurfer being ready
    const event = new Event('wavesurfer_ready')
    window.dispatchEvent(event)

    setDuration(wavesurfer.getDuration())
    setCurrentTime(wavesurfer.getCurrentTime())

    wavesurfer.clearRegions()

    if (queuePlay) {
      wavesurfer.playPause()
      setQueuePlay(false)
    }

    if (queueSeek) {
      seekToTime(queueSeek, selectedArtist, true)
      setQueueSeek(false)
    }

    if (artistAudio[selectedArtist].tracklist) {
      artistAudio[selectedArtist].tracklist.forEach((region) => {
        region.drag = false
        region.resize = false
        region.start = timeToSeconds(region.time)
        region.id = region.title
        wavesurfer.addRegion(region)
      })
    }
  }, [ready])

  // Load media if selected artist changes
  useEffect(() => {
    wavesurfer && load(artistAudio[selectedArtist].audio[0]['.mp3'], artistAudio[selectedArtist].audio[0]['.json'])
  }, [artistAudio, selectedArtist, wavesurfer])

  // Fetches the file and loads it into wavesurfer
  const load = useCallback(
    (mp3, json) => {
      setReady(false)
      if (json.publicURL) {
        if (!window.cached_json[json.publicURL]) {
          // If we have a URL and no cache we need to fetch it
          fetch(json.publicURL.replace('#', '%23'))
            .then((response) => response.json())
            .then((data) => {
              window.cached_json[json.publicURL] = data
              wavesurfer.load(mp3.publicURL, window.cached_json[json.publicURL], 'metadata')
            })
            .catch((err) => {
              console.log('Fetch Error :-S', err)
            })
        } else {
          // Else we can just use the cached one
          wavesurfer.load(mp3.publicURL, window.cached_json[json.publicURL], 'metadata')
        }
      } else {
        // This means we've got data rather than a URL, so no fetching needed
        wavesurfer.load(mp3.publicURL, json.data, 'metadata')
      }
    },
    [wavesurfer]
  )

  const seekToTime = useCallback(
    (time, artistIndex, play) => {
      // If we haven't loaded it we need to load THEN seek
      if (artistIndex !== selectedArtist) {
        selectArtist(artistIndex, play, time)
        return
      }

      const timeSeconds = timeToSeconds(time)
      const totalTimeSeconds = wavesurfer.getDuration()
      const ratio = timeSeconds / totalTimeSeconds

      wavesurfer.seekTo(ratio)
      if (play) wavesurfer.play()
    },
    [wavesurfer]
  )

  const formatTime = useCallback((time) => {
    const mins = ~~(time / 60)
    const secs = ('0' + ~~(time % 60)).slice(-2)
    return mins + ':' + secs
  })

  const previous = useCallback(() => {
    const newSelectedArtist = Math.max(selectedArtist - 1, 0)
    setSelectedArtist(newSelectedArtist)
  }, [selectedArtist])

  const next = useCallback(() => {
    const newSelectedArtist = Math.min(selectedArtist + 1, artistAudio.length - 1)
    setSelectedArtist(newSelectedArtist)
  }, [selectedArtist, artistAudio])

  const selectArtist = useCallback(
    (newSelectedArtist, play, seek) => {
      // If we're trying to select an artist we already have loaded and we want to play then just do it
      if (selectedArtist === newSelectedArtist) {
        if (play) wavesurfer.playPause()
        return
      }

      wavesurfer.stop()
      wavesurfer.empty()

      setSelectedArtist(newSelectedArtist)
      setQueuePlay(play)
      setQueueSeek(seek)
    },
    [selectedArtist, wavesurfer]
  )

  return (
    <PlayerWrapper className="player">
      <Titlebar></Titlebar>
      <AudioWrapper>
        <Transport>
          <TransportButton disabled={!ready} id="prev" onClick={previous}>
            <FaBackward />
          </TransportButton>
          <RoundButton disabled={!ready} className={playing ? 'active' : ''} size="40px" onClick={() => wavesurfer.playPause()}>
            {!playing ? <FaPlayCircle /> : <FaPauseCircle />}
          </RoundButton>
          <TransportButton disabled={!ready} id="next" onClick={next}>
            <FaForward />
          </TransportButton>
        </Transport>
        <WaveWrapper ref={waveformRef}>
          {ready && <LengthWrapper style={{ left: '0px' }}>{formatTime(currentTime)}</LengthWrapper>}
          {ready && <LengthWrapper style={{ right: '0px' }}>{formatTime(duration)}</LengthWrapper>}
        </WaveWrapper>
        {!ready && (
          <LoadingProgress>
            <LoadingSpinner />
          </LoadingProgress>
        )}
      </AudioWrapper>
      <TracklistWrapper>
        {artistAudio.map((item, index) => (
          <div key={item.title}>
            <li className={selectedArtist == index ? 'active' : ''} onClick={() => selectArtist(index)}>
              <span className="title">
                {index + 1}. {item.title}
              </span>
              <span className="listButton">
                <a title={'Download MP3: ' + item.title} href={item.audio[0]['.mp3']['publicURL']} target="_blank">
                  <FaDownload />
                </a>
              </span>
            </li>
            {item.tracklist && (
              <ul className="tracklist">
                {item.tracklist.map((item) => {
                  return (
                    <li key={item.title} onClick={() => seekToTime(item.time, index, true)}>
                      {item.title} ({item.time})
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </TracklistWrapper>
    </PlayerWrapper>
  )
})

const PlayerWrapper = styled.div`
  transition: all 150ms ease-in-out;
  border: 3px groove #585662;
  background: linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%);
`

const AudioWrapper = styled.div`
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;
  border: 3px groove #585662;

  region.wavesurfer-region {
    cursor: pointer !important;
    width: 2px !important;
    z-index: 4 !important;
    background-color: rgba(255, 255, 255, 0.5) !important;
  }

  region.wavesurfer-region:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    z-index: 5 !important;
  }

  region.wavesurfer-region:hover::after {
    background-color: rgba(255, 255, 255, 1);
    z-index: 5 !important;
    max-width: 1000px;
  }

  region.wavesurfer-region::after {
    content: attr(data-id);
    z-index: 4 !important;
    -webkit-transition: background-color 100ms ease-in-out;
    -moz-transition: background-color 100ms ease-in-out;
    transition: background-color 100ms ease-in-out;
    position: absolute;
    bottom: 0;
    color: black;
    background-color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 85%;
  }

  #prev {
    display: none;
  }

  #next {
    display: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    #prev {
      display: initial;
    }

    #next {
      display: initial;
    }
  }
`

const Titlebar = styled.div`
  text-align: left;
  background-color: #e7d1ab;
  color: #cccfd6;
  font-size: 12px;
  font-family: monospace;
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 10px;
  border-radius: 2px;
  &::before {
    background: -webkit-linear-gradient(top, #fffcdf 0%, #fffcdf 29%, #736c50 32%, #736c50 66%, #d5ceb1 69%, #d5ceb1 100%);
    content: '';
    height: 8px;
    width: 100%;
    margin-top: 1px;
    position: absolute;
    z-index: 0;
  }
  &::after {
    content: 'AUDIO PLAYER';
    position: absolute;
    margin-top: -5px;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    z-index: 1;
    left: 50%;
    transform: translate(-50%);
    background-color: #353551;
  }
`

const TransportButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  padding: 10px;
  color: #bfced9;

  svg {
    width: 80%;
    height: 80%auto;
  }
`

const Transport = styled.div``

const TracklistWrapper = styled(Menu)`
  overflow-y: auto;
  max-height: 90vh;
  background-color: black;
  margin: 5px;
  border: 3px groove #585662;

  li {
    line-height: 2.5rem;
  }

  .title {
    font-family: monospace;
    font-size: 18px !important;
    color: #28da1d;
  }

  .active {
    background-color: #0818c4 !important;
  }

  > li:hover:not(.active) {
    background-color: ${() => lighten(0.1, '#0818c4')};
  }

  .tracklist {
    margin-top: 0px;
    margin-bottom: 0px;
  }
`

const WaveWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  wave {
    z-index: 10;
  }
`

const LengthWrapper = styled.div`
  ${scale(-0.8)};
  line-height: 1em;
  color: #28da1d;
  pointer-events: none;
  z-index: 11;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-family: monospace;
  background-color: black;
`

const TitleWrapper = styled.div`
  ${scale(-0.5)};
  line-height: 1em;
  position: absolute;
  display: inline-block;
  text-align: center;
  top: 0px;
  z-index: 11;
  color: #000;
  background-color: ${(props) => props.theme.secondaryColor};
  color: white;
`

const LoadingProgress = styled.div`
  position: absolute;
`
