// Player.js
// An audio player for playing media from one or more artists.
// Parameters:
//  - artistMedia: Media to be displayed
//  - onPlay (optional): Callback for when it's played
//  - onPause (optional): Callback for when it's paused
//  - onFileChange (optional): Callback for when the song changes
//  - selectedArtist (optional): The artist to start with. Defaults to the first.


import React from 'react'
import styled from '@emotion/styled'
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { theme } from '../utils/theme'
import PlayerMenu from './PlayerMenu';
import RoundButton from './RoundButton';
import { scale } from '../utils/typography';
import LoadingSpinner from './LoadingSpinner';

const PlayerWrapper = styled.div`
  box-shadow: 0 -6px 12px rgba(0,0,0,.175);
  display: flex;
  align-items: center;
  justify-content: center;

  region.wavesurfer-region {
    cursor: pointer !important;
    width: 2px !important;
    z-index: 4 !important;
    background-color: rgba(255,255,255,0.5) !important;
  }

  region.wavesurfer-region:hover {
    background-color: rgba(255,255,255,1) !important;
    z-index: 5 !important;
  }

  region.wavesurfer-region:hover::after {
    background-color: rgba(255,255,255,1);
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
    background-color: rgba(255,255,255,0.5);
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

  @media screen and (min-width: ${props => props.theme.breakpoints.md}) {
    #prev {
      display: initial;
    }

    #next {
      display: initial;
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
  color: ${props => props.theme.textColor};
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
  background-color: ${props => props.theme.secondaryColor};
  color: white;
`

const LoadingProgress = styled.div`
  position: absolute;
`

export default class Player extends React.Component {

  constructor(props) {
    super(props)
    this.waveformRef = React.createRef();
    this.state = {
      playing: false,
      ready: false,
      currentFile: undefined,
      currentTime: undefined,
      duration: undefined,
      selectedArtist: this.props.selectedArtist || 0,
      queuePlay: false,
      queueSeek: false
    }

  }

  componentDidMount() {
    window.cached_json = window.cached_json || {};

    // because otherwise window is not defined
    this.wavesurfer = require('wavesurfer.js');
    this.RegionsPlugin = require('wavesurfer.js/dist/plugin/wavesurfer.regions');

    if (this.el) {

      this.wavesurfer = this.wavesurfer.create({
        container: this.el,
        waveColor: theme.default.waveformColor,
        height: 45,
        hideScrollbar: true,
        normalize: true,
        responsive: true,
        backend: "MediaElement",
        pixelRatio: "1",
        forceDecode: false,
        progressColor: theme.default.waveformProgressColor,
        barWidth: '2',
        plugins: [
          this.RegionsPlugin.create(),
        ]
      })

      this.wavesurfer.on('ready', this.onReady)
      this.wavesurfer.on('seek', this.updateTime)
      this.wavesurfer.on('finish', this.onFinish)
      this.wavesurfer.on('play', this.onPlay)
      this.wavesurfer.on('pause', this.onPause)
      this.wavesurfer.on('audioprocess', this.updateTime)

      this.loadSelectedMedia()
    }
  }

  loadSelectedMedia = () => {
    this.load(this.props.artistMedia[this.state.selectedArtist].audio[0][".mp3"].publicURL, this.props.artistMedia[this.state.selectedArtist].audio[0][".json"].publicURL)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.artistMedia !== prevProps.artistMedia || this.state.selectedArtist !== prevState.selectedArtist) {
      this.loadSelectedMedia()
    }
  }

  componentWillUnmount = () => {
    this.wavesurfer && this.wavesurfer.destroy();
  }

  load = (src, jsonSrc) => {
    this.setState({ready: false})
    if (jsonSrc && !window.cached_json[jsonSrc]) {
      fetch(jsonSrc)
        .then(response => response.json())
        .then(data => {
            window.cached_json[jsonSrc] = data
            this.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata")
        })
        .catch(err => {
          console.log('Fetch Error :-S', err)
        });
    } else {
      this.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata")
    }
  }

  onReady = () => {
    // sometimes its not ready so we have to do this horrible timeout thing
    setTimeout(() => {
      const currentTime = this.wavesurfer.getCurrentTime()
      const duration = this.wavesurfer.getDuration()
      this.setState({duration, currentTime, ready: true})

      this.wavesurfer.clearRegions()

      if (this.state.queuePlay) {
        this.wavesurfer.playPause()
        this.setState({queuePlay: false})
      }

      if (this.state.queueSeek) {
        this.seekToTime(this.state.queueSeek, this.state.selectedArtist, true)
        this.setState({queueSeek: false})
      }

      if (this.props.artistMedia[this.state.selectedArtist].tracklist) {
        this.props.artistMedia[this.state.selectedArtist].tracklist.forEach((region) => {
          region.drag = false
          region.resize = false
          region.start = this.timeToSeconds(region.time)
          region.id = region.title
          this.wavesurfer.addRegion(region)
        });
      }
    }, 250)
  }

  onPlay = () => {
    this.setState({playing: true})
    this.props.onPlay && this.props.onPlay()
  }

  onPause = () => {
    this.setState({playing: false})
    this.props.onPause && this.props.onPause()
  }

  onFinish = () => {
    this.next()
  }

  progressFromTime = (time, duration) => {
    const timeSeconds = this.timeToSeconds(time)
    return timeSeconds/duration
  }

  timeToSeconds = (str) => {
    const a = str.split(':')
    return a.length == 2 ? (+a[0]) * 60 + (+a[1]) : (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
  }

  seekToTime = (time, artistIndex, play) => {

    // If we haven't loaded it we need to load THEN seek
    if (artistIndex !== this.state.selectedArtist) {
      this.selectArtist(artistIndex, play, time)
      return
    }

    const timeSeconds = this.timeToSeconds(time)
    const totalTimeSeconds = this.wavesurfer.getDuration()
    const ratio = timeSeconds/totalTimeSeconds

    this.wavesurfer.seekTo(ratio)
    if (play) this.wavesurfer.play()
  }

  formatTime = (time) => {
    const mins = ~~(time / 60)
    const secs = ("0" + ~~(time % 60)).slice(-2)
    return mins + ":" + secs
  }

  updateTime = () => {
    const currentTime = this.wavesurfer.getCurrentTime()
    this.setState({currentTime})
  }

  updateDuration = () => {
    const duration = this.wavesurfer.getDuration()
    this.setState({duration})
  }

  playPause = () => {
    this.wavesurfer.playPause()
  }

  previous = () => {
    const selectedArtist = Math.max(this.state.selectedArtist - 1, 0)
    this.setState({selectedArtist})
    this.props.onFileChange && this.props.onFileChange(selectedArtist)
  }

  next = () => {
    const selectedArtist = Math.min(this.state.selectedArtist + 1, this.props.artistMedia.length - 1)
    this.setState({selectedArtist})
    this.props.onFileChange && this.props.onFileChange(selectedArtist)
  }

  selectArtist = (selectedArtist, play, seek) => {
    // If we're trying to select an artist we already have loaded and we want to play then just do it
    if (selectedArtist === this.state.selectedArtist) {
      if (play) this.playPause()
      return
    }

    this.wavesurfer.stop()
    this.wavesurfer.empty()
    this.props.onFileChange && this.props.onFileChange(selectedArtist)
    this.setState({selectedArtist, queuePlay: play, queueSeek: seek})
  }

  render = () => {
    return (
      <PlayerWrapper>
        {this.state.ready && <div>
          <RoundButton id="prev" size="30px" onClick={this.previous}><MdSkipPrevious/></RoundButton>
          <RoundButton className={this.state.playing ? "active" : ""} size="40px" onClick={this.playPause}>{!this.state.playing ? <MdPlayArrow/> : <MdPause/>}</RoundButton>
          <RoundButton id="next" size="30px" onClick={this.next}><MdSkipNext/></RoundButton>
        </div>}
        <WaveWrapper ref={el => (this.el = el)}>
          {this.state.ready && <LengthWrapper style={{left: "0px"}}>{this.formatTime(this.state.currentTime)}</LengthWrapper>}
          {this.state.ready && <LengthWrapper style={{right: "0px"}}>{this.formatTime(this.state.duration)}</LengthWrapper>}
        </WaveWrapper>
        {!this.state.ready && <LoadingProgress>{LoadingSpinner}</LoadingProgress>}
        <TitleWrapper className="title-wrapper"><span>{this.props.artistMedia[this.state.selectedArtist].title}</span></TitleWrapper>
        <PlayerMenu width="100%" selected={this.state.selectedArtist} selectCallback={this.selectArtist} seekCallback={this.seekToTime} list={this.props.artistMedia}/>
      </PlayerWrapper>
    )
  }
}

Player.defaultProps = {
  src: "",
  jsonSrc: null,
}
