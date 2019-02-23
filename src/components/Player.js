import React from 'react'
import styled from 'styled-components'
import { MdPlayArrow, MdPause } from 'react-icons/md';
import { theme } from '../utils/theme'

const PlayButton = styled.button`
  z-index: 11;
  color: #000;
  left: 0px;
  border-radius: 50%;
  position: absolute;
  background-color: white;
`

const PlayerWrapper = styled.div`
  position: relative;
`

const WaveWrapper = styled.div`
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
  bottom: 20px;
`

const TitleWrapper = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 0;
  height: 20px;
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
        height: 58,
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

      this.wavesurfer.on('ready', this.updateDuration);
      this.wavesurfer.on('seek', this.updateTime);
      this.wavesurfer.on('play', () => this.setState({playing: true}))
      this.wavesurfer.on('pause', () => this.setState({playing: false}))
      this.wavesurfer.on('audioprocess', this.updateTime);

      this.initialize(this.props.src, this.props.jsonSrc);
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.src !== prevProps.src) {
      this.initialize(this.props.src, this.props.jsonSrc);
    }
  }

  componentWillUnmount = () => {
    this.wavesurfer && this.wavesurfer.destroy();
  }

  initialize = (src, jsonSrc) => {
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

  playPause = () => {
    this.wavesurfer.playPause();
  }

  render = () => {
    return (
      <PlayerWrapper>
        <PlayButton onClick={this.playPause}>{!this.state.playing ? <MdPlayArrow/> : <MdPause/>}</PlayButton>
        <WaveWrapper ref={el => (this.el = el)}></WaveWrapper>
        <TitleWrapper className="title-wrapper"><span>{this.props.title}</span></TitleWrapper>
        <LengthWrapper style={{left: "45px"}}>{this.formatTime(this.state.currentTime)}</LengthWrapper>
        <LengthWrapper style={{right: "0px"}}>{this.formatTime(this.state.duration)}</LengthWrapper>
      </PlayerWrapper>
    )
  }
}

Player.defaultProps = {
  src: "",
  jsonSrc: null,
}
