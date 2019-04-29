// Player.js
// An audio player for playing media from one or more artists.
// Parameters:
//  - artistMedia: Media to be displayed
//  - onPlay (optional): Callback for when it's played
//  - onPause (optional): Callback for when it's paused
//  - onFileChange (optional): Callback for when the song changes
//  - selectedArtist (optional): The artist to start with. Defaults to the first.


import React from 'react'
import styled from 'styled-components'
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { theme } from '../utils/theme'
import PlayerMenu from './PlayerMenu';
import RoundButton from './RoundButton';
import { scale } from '../utils/typography';

const PlayerWrapper = styled.div`
  box-shadow: 0 -6px 12px rgba(0,0,0,.175);
  display: flex;
  align-items: center;
  justify-content: center;

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
  background: white;
  color: #000;
  z-index: 11;
  position: absolute;
  bottom: 0px;
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
      progress: 0,
      selectedArtist: this.props.selectedArtist || 0,
      queuePlay: false
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
    if (jsonSrc && !window.cached_json[jsonSrc]) {
      fetch(jsonSrc)
        .then(response => response.json())
        .then(data => {
            window.cached_json[jsonSrc] = data;
            this.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata");
        })
        .catch(err => {
          console.log('Fetch Error :-S', err);
        });
    } else {
      this.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata");
    }
  }

  onReady = () => {
    this.updateDuration();
    this.updateTime();
    if (this.state.queuePlay) {
      this.wavesurfer.playPause();
      this.setState({queuePlay: false})
    }
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
    const timeSeconds = this.timeToSeconds(time);
    return timeSeconds/duration;
  }

  timeToSeconds = (str) => {
    const p = str.split(':'), s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
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
    this.wavesurfer.playPause();
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

  selectArtist = (selectedArtist, play) => {
    // If we're trying to select an artist we already have loaded and we want to play then just do it
    if (play && selectedArtist === this.state.selectedArtist) {
      this.playPause();
      return;
    }
    this.props.onFileChange && this.props.onFileChange(selectedArtist)
    this.setState({selectedArtist, queuePlay: play})
  }

  render = () => {
    return (
      <PlayerWrapper>
        <div>
          <RoundButton id="prev" size="30px" onClick={this.previous}><MdSkipPrevious/></RoundButton>
          <RoundButton className={this.state.playing ? "active" : ""} size="40px" onClick={this.playPause}>{!this.state.playing ? <MdPlayArrow/> : <MdPause/>}</RoundButton>
          <RoundButton id="next" size="30px" onClick={this.next}><MdSkipNext/></RoundButton>
        </div>
        <WaveWrapper ref={el => (this.el = el)}>
          <LengthWrapper style={{left: "0px"}}>{this.formatTime(this.state.currentTime)}</LengthWrapper>
          <LengthWrapper style={{right: "0px"}}>{this.formatTime(this.state.duration)}</LengthWrapper>
        </WaveWrapper>
        <TitleWrapper className="title-wrapper"><span>{this.props.artistMedia[this.state.selectedArtist].title}</span></TitleWrapper>
        <PlayerMenu width="100%" selected={this.state.selectedArtist} callback={this.selectArtist} list={this.props.artistMedia}/>
      </PlayerWrapper>
    )
  }
}

Player.defaultProps = {
  src: "",
  jsonSrc: null,
}
