import React from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import { theme } from '../utils/theme'

export default class Waveform extends React.Component {

  constructor(props) {
    super(props)
    window.cached_json = window.cached_json || {};
    this.state = {
      playing: false
    }
    this.waveformRef = React.createRef();
  }

  componentDidMount() {

    console.log("Waveform mounted");

    window.wavesurfer = WaveSurfer.create({
      container: this.waveformRef.current,
      waveColor: theme.default.waveformColor,
      height: 58,
      hideScrollbar: true,
      normalize: true,
      backend: "MediaElement",
      pixelRatio: "1",
      forceDecode: false,
      progressColor: theme.default.waveformProgressColor,
      barWidth: '2',
      plugins: [
        RegionsPlugin.create(),
      ]
    })

    window.wavesurfer.on('ready', () => this.props.onReady && this.props.onReady(window.wavesurfer));
    window.wavesurfer.on('play', () => this.setState({playing: true}))
    window.wavesurfer.on('audioprocess', () => this.props.onAudioprocess && this.props.onAudioprocess(window.wavesurfer));

    if (this.state.playing) window.wavesurfer.play();

    this.initialize(this.props.src, this.props.jsonSrc);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      this.initialize(this.props.src, this.props.jsonSrc);
    }
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
              window.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata");
            })
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    } else {
      window.wavesurfer.load(src, window.cached_json[jsonSrc], "metadata");
    }
  }

  render = () => {
    return (
      <div className='wave' ref={this.waveformRef}></div>
    )
  }
}

Waveform.defaultProps = {
  src: "",
  jsonSrc: null,
}
