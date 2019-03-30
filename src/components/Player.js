import React from 'react'
import styled from 'styled-components'
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { theme } from '../utils/theme'
import { rhythm } from '../utils/typography';
import Dropdown from './Dropdown';

const RoundButton = styled.button`
  z-index: 11;
  color: ${props => props.theme.highlightColor2};
  border-color: ${props => props.theme.highlightColor2};
  border-radius: 50%;
  background-color: transparent;
  height: ${props => props.size};
  width: ${props => props.size};
  padding: 0;
  outline: 0;
  svg {
    width: 100%;
    height: 100%;
  }
`

const PlayerControls = styled.div`
`

const DropdownWrapper = styled.div`
`

const PlayerWrapper = styled.div`
  box-shadow: 0 -6px 12px rgba(0,0,0,.175);
  display: flex;
  align-items: center;
  justify-content: center;
`

const WaveWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  wave {
    z-index: 10;
  }
`

const LengthWrapper = styled.div`
  background: white;
  color: #000;
  z-index: 11;
  font-size: 12px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`

const TitleWrapper = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: -10px;
  z-index: 10;
  color: #000;
  font-size: 12px;
  span {
    background-color: white;
  }
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
      selectedArtist: 0
    }

  }

  componentDidMount() {

    window.cached_json = window.cached_json || {};

    // because otherwise window is not defined
    this.WaveSurfer = require('wavesurfer.js');
    this.RegionsPlugin = require('wavesurfer.js/dist/plugin/wavesurfer.regions');

    if (this.el) {

      this.wavesurfer = this.WaveSurfer.create({
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

      this.wavesurfer.on('ready', () => { this.updateDuration(); this.updateTime();})
      this.wavesurfer.on('seek', this.updateTime)
      this.wavesurfer.on('finish', this.finish);
      this.wavesurfer.on('play', () => this.setState({playing: true}))
      this.wavesurfer.on('pause', () => this.setState({playing: false}))
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

  finish = () => {
    this.next();
  }

  playPause = () => {
    this.wavesurfer.playPause();
  }

  previous = () => {
    const selectedArtist = Math.max(this.state.selectedArtist - 1, 0)
    this.setState({selectedArtist})
  }

  next = () => {
    const selectedArtist = Math.min(this.state.selectedArtist + 1, this.props.artistMedia.length - 1)
    this.setState({selectedArtist})
  }

  selectArtist = (selectedArtist) => {
    this.setState({selectedArtist})
  }

  render = () => {
    return (
      <PlayerWrapper>
        <PlayerControls>
          <RoundButton size="30px" onClick={this.previous}><MdSkipPrevious/></RoundButton>
          <RoundButton className={this.state.playing ? "active" : ""} size="40px" onClick={this.playPause}>{!this.state.playing ? <MdPlayArrow/> : <MdPause/>}</RoundButton>
          <RoundButton size="30px" onClick={this.next}><MdSkipNext/></RoundButton>
        </PlayerControls>
        <WaveWrapper ref={el => (this.el = el)}>
          <LengthWrapper style={{left: "0px"}}>{this.formatTime(this.state.currentTime)}</LengthWrapper>
          <LengthWrapper style={{right: "0px"}}>{this.formatTime(this.state.duration)}</LengthWrapper>
          <TitleWrapper className="title-wrapper"><span>{this.props.artistMedia[this.state.selectedArtist].audio[0][".mp3"].name}</span></TitleWrapper>
        </WaveWrapper>
        <DropdownWrapper>
          <Dropdown width="100%" callback={this.selectArtist} list={this.props.artistMedia}/>
        </DropdownWrapper>
      </PlayerWrapper>
    )
  }
}

Player.defaultProps = {
  src: "",
  jsonSrc: null,
}
