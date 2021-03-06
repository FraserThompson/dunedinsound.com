// Player.js
// An audio player for playing media from one or more artists.
// Parameters:
//  - artistAudio: Media to be displayed

import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdFileDownload } from 'react-icons/md'
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
    wavesurfer && load(artistAudio[selectedArtist].audio[0]['.mp3'].publicURL, artistAudio[selectedArtist].audio[0]['.json'].publicURL)
  }, [artistAudio, selectedArtist, wavesurfer])

  // Fetches the file and loads it into wavesurfer
  const load = useCallback(
    (src, jsonSrc) => {
      setReady(false)
      if (jsonSrc && !window.cached_json[jsonSrc]) {
        fetch(jsonSrc.replace('#', '%23'))
          .then((response) => response.json())
          .then((data) => {
            window.cached_json[jsonSrc] = data
            wavesurfer.load(src, window.cached_json[jsonSrc], 'metadata')
          })
          .catch((err) => {
            console.log('Fetch Error :-S', err)
          })
      } else {
        wavesurfer.load(src, window.cached_json[jsonSrc], 'metadata')
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
    <div className="player">
      <PlayerWrapper>
        {ready && (
          <div>
            <RoundButton id="prev" size="30px" onClick={previous}>
              <MdSkipPrevious />
            </RoundButton>
            <RoundButton className={playing ? 'active' : ''} size="40px" onClick={() => wavesurfer.playPause()}>
              {!playing ? <MdPlayArrow /> : <MdPause />}
            </RoundButton>
            <RoundButton id="next" size="30px" onClick={next}>
              <MdSkipNext />
            </RoundButton>
          </div>
        )}
        <WaveWrapper ref={waveformRef}>
          {ready && <LengthWrapper style={{ left: '0px' }}>{formatTime(currentTime)}</LengthWrapper>}
          {ready && <LengthWrapper style={{ right: '0px' }}>{formatTime(duration)}</LengthWrapper>}
        </WaveWrapper>
        {!ready && (
          <LoadingProgress>
            <LoadingSpinner />
          </LoadingProgress>
        )}
      </PlayerWrapper>
      <TracklistWrapper>
        {artistAudio.map((item, index) => (
          <div key={item.title}>
            <li className={selectedArtist == index ? 'active' : ''} onClick={() => selectArtist(index)}>
              <span id="title">
                {index + 1}. {item.title}
              </span>
              <span className="listButton">
                <a title={'Download MP3: ' + item.title} href={item.audio[0]['.mp3']['publicURL']} target="_blank">
                  <MdFileDownload />
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
    </div>
  )
})

const PlayerWrapper = styled.div`
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.25);
  border-top: 1px solid ${(props) => darken(0.025, props.theme.primaryColor)};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.primaryColor};

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

const TracklistWrapper = styled(Menu)`
  .title {
    ${scale(1)}
  }
  > li:hover:not(.active) {
    background-color: ${(props) => lighten(0.1, props.theme.backgroundColor)};
  }
  .tracklist {
    margin-top: 0px;
    margin-bottom: 0px;
    li {
      ${scale(-0.5)};
    }
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
  color: ${(props) => props.theme.textColor};
  pointer-events: none;
  z-index: 11;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
