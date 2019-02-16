import React from 'react'
import styled from 'styled-components'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import { theme } from '../utils/theme'

export default class Player extends React.Component {

  constructor(props) {
    super(props)
    window.cached_json = window.cached_json || {};
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

    if (this.el) {

      const waveParams = {
        container: this.el,
        waveColor: "green",
        progressColor: "purple",
        cursorColor: '#5173E7',
        cursorWidth: 3,
        barWidth: 1,
        responsive: true,
        height: 58
      }

      // this.wavesurfer = WaveSurfer.create({
      //   container: this.el,
      //   waveColor: theme.default.waveformColor,
      //   height: 58,
      //   hideScrollbar: true,
      //   normalize: true,
      //   responsive: true,
      //   backend: "MediaElement",
      //   pixelRatio: "1",
      //   forceDecode: false,
      //   progressColor: theme.default.waveformProgressColor,
      //   barWidth: '2',
      //   plugins: [
      //     RegionsPlugin.create(),
      //   ]
      // })

      this.wavesurfer = WaveSurfer.create(waveParams);

      this.wavesurfer.on('ready', this.updateDuration);
      this.wavesurfer.on('play', () => this.setState({playing: true}))
      this.wavesurfer.on('audioprocess', () => this.updateTime);

      this.initialize(this.props.src, this.props.jsonSrc);
    }
  }

  componentWillUnmount = () => {
    this.wavesurfer && this.wavesurfer.destroy();
  }

  initialize = (src, jsonSrc) => {
    if (jsonSrc && !window.cached_json[jsonSrc]) {
      fetch(jsonSrc)
        .then(response => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }

            response.json().then(data => {
              window.cached_json[jsonSrc] = data;
              this.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata");
            })
          }
        )
        .catch(function(err) {
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
    var p = str.split(':'),
        s = 0, m = 1;

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
    const progress = progressFromTime(currentTime, this.state.duration);
    this.setState({currentTime, progress})
  }

  updateDuration = () => {
    const duration = this.wavesurfer.getDuration()
    this.setState({duration})
    if (!this.state.ready) this.setState({length, ready: true}) // because otherwise the re-render will cause it to loop forever
  }

  playPause = () => {
    this.wavesurfer.playPause();
    this.setState({ playing: !this.state.playing })
  }

  render = () => {

    const PlayButton = styled.button`
      font-size: 16px;
      width: 40px;
      top: 11px;
      z-index: 5;
      left: 0px;
      border-radius: 50%;
      position: absolute;
      background-color: white;
    `

    const Player = styled.div`
      position: relative;
    `

    const LengthWrapper = styled.div`
      background: black;
      color: #999999;
      z-index: 10;
      font-size: 12px;
      position: absolute;
      bottom: 20px;
    `

    return (
      <Player>
        <PlayButton onClick={this.playPause}>{this.state.playing === 0 ? "PLAY" : "PAUSE"}</PlayButton>
        <div ref={el => (this.el = el)}></div>
        <div className="title-wrapper">{this.state.currentFile}</div>
        <LengthWrapper style={{left: "45px"}}>{this.formatTime(this.state.currentTime)}</LengthWrapper>
        <LengthWrapper style={{right: "0px"}}>{this.formatTime(this.state.duration)}</LengthWrapper>
      </Player>
    )
  }
}

Player.defaultProps = {
  src: "",
  jsonSrc: null,
}
