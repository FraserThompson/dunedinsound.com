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
   - barebones: If true it will just render the waveform without tracklist/transport.
   - playOnLoad: If true it will play the track once it loads.
   - setWaveSurferCallback: Pass a function and this will return the wavesurfer obj
     when it sets it, so the parent component can use it.
*/

import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { FaPlayCircle, FaPauseCircle, FaBackward, FaForward, FaDownload } from 'react-icons/fa'
import { theme } from '../utils/theme'
import RoundButton from './RoundButton'
import { scale } from '../utils/typography'
import LoadingSpinner from './LoadingSpinner'
import { timeToSeconds } from '../utils/helper'
import { AudioWrapper, PlayerWrapper, Titlebar, TracklistWrapper, TransportButton } from './Winamp'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

export default React.memo(({ artistAudio, barebones, playOnLoad, setWaveSurferCallback = null }) => {
  const waveformRef = useRef()

  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(undefined)
  const [duration, setDuration] = useState(undefined)
  const [selectedArtist, setSelectedArtist] = useState(0)
  const [queuePlay, setQueuePlay] = useState(false)
  const [queueSeek, setQueueSeek] = useState(false)

  const [wavesurfer, setWaveSurfer] = useState(undefined)
  const [regionsPlugin, setRegionsPlugin] = useState(undefined)

  // Create instance on mount
  useEffect(() => {
    window.cached_json = window.cached_json || {}

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: theme.default.waveformColor,
      height: 60,
      hideScrollbar: true,
      normalize: true,
      progressColor: theme.default.waveformProgressColor,
      barWidth: '2',
    })

    const wsRegions = ws.registerPlugin(RegionsPlugin.create())

    setWaveSurfer(ws)
    setRegionsPlugin(wsRegions)
  }, [])

  // Attach callbacks when we have the instance
  useEffect(() => {
    if (!wavesurfer) return
    wavesurfer.on('ready', (duration) => {
      setReady(true)
      setDuration(duration)
    })
    wavesurfer.on('finish', () => next(true))
    wavesurfer.on('play', () => setPlaying(true))
    wavesurfer.on('pause', () => setPlaying(false))
    wavesurfer.on('timeupdate', (time) => setCurrentTime(time))
    return () => wavesurfer && wavesurfer.destroy()
  }, [wavesurfer])

  // Update UI when ready
  useEffect(() => {
    if (!wavesurfer) return

    // So other components can respond to Wavesurfer being ready
    const event = new Event('wavesurfer_ready')
    window.dispatchEvent(event)

    setCurrentTime(wavesurfer.getCurrentTime())

    regionsPlugin.clearRegions()

    if (playOnLoad) {
      wavesurfer.play()
    }

    // So we can trigger these after the player is ready
    if (queuePlay) {
      // We need this timeout for some reason
      setTimeout(() => wavesurfer.play(), 200)
      setQueuePlay(false)
    }

    if (queueSeek) {
      seekToTime(queueSeek, selectedArtist, true)
      setQueueSeek(false)
    }

    if (artistAudio[selectedArtist].tracklist) {
      artistAudio[selectedArtist].tracklist.forEach((track) => {
        const region = {
          content: track.title,
          start: timeToSeconds(track.time),
          drag: false,
          resize: false,
        }
        regionsPlugin.addRegion(region)
      })
    }
  }, [ready])

  // Load media if selected artist changes
  useEffect(() => {
    wavesurfer && load(artistAudio[selectedArtist].audio[0]['.mp3'], artistAudio[selectedArtist].audio[0]['.json'])
  }, [artistAudio, selectedArtist, wavesurfer])

  useEffect(() => {
    setWaveSurferCallback && setWaveSurferCallback(wavesurfer)
  }, [wavesurfer])

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
              wavesurfer.load(mp3.publicURL, window.cached_json[json.publicURL])
            })
            .catch((err) => {
              console.log('Fetch Error :-S', err)
            })
        } else {
          // Else we can just use the cached one
          wavesurfer.load(mp3.publicURL, window.cached_json[json.publicURL])
        }
      } else {
        // This means we've got data rather than a URL, so no fetching needed
        wavesurfer.load(mp3.publicURL, json.data)
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
    selectArtist(newSelectedArtist)
  }, [selectedArtist])

  const next = useCallback(
    (play) => {
      const newSelectedArtist = Math.min(selectedArtist + 1, artistAudio.length - 1)
      selectArtist(newSelectedArtist, play)
    },
    [selectedArtist, artistAudio]
  )

  const selectArtist = useCallback(
    (newSelectedArtist, play, seek) => {
      setQueuePlay(play)
      setQueueSeek(seek)
      setSelectedArtist(newSelectedArtist)

      // If we're trying to select an artist we already have loaded and we want to play then just do it
      if (selectedArtist === newSelectedArtist && wavesurfer) {
        if (play) wavesurfer.playPause()
        return
      }

      wavesurfer && wavesurfer.stop()
      wavesurfer && wavesurfer.empty()
    },
    [selectedArtist, wavesurfer]
  )

  return (
    <PlayerWrapper barebones={barebones} className="player">
      {!barebones && <Titlebar />}
      <AudioWrapper barebones={barebones}>
        {!barebones && (
          <div>
            <TransportButton disabled={!ready} id="prev" onClick={() => previous()}>
              <FaBackward />
            </TransportButton>
            <RoundButton disabled={!ready} className={playing ? 'active' : ''} size="40px" onClick={() => wavesurfer.playPause()}>
              {!playing ? <FaPlayCircle /> : <FaPauseCircle />}
            </RoundButton>
            <TransportButton disabled={!ready} id="next" onClick={() => next()}>
              <FaForward />
            </TransportButton>
          </div>
        )}
        <WaveWrapper id="waveform" ref={waveformRef}>
          {ready && <LengthWrapper style={{ left: '0px' }}>{formatTime(currentTime)}</LengthWrapper>}
          {ready && <LengthWrapper style={{ right: '0px' }}>{formatTime(duration)}</LengthWrapper>}
        </WaveWrapper>
        {!ready && (
          <LoadingProgress>
            <LoadingSpinner />
          </LoadingProgress>
        )}
      </AudioWrapper>

      {!barebones && (
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
      )}
    </PlayerWrapper>
  )
})

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

const LoadingProgress = styled.div`
  position: absolute;
`
