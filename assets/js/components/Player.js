class Player {

  constructor(element, color, height) {
    this.element = element;
    this.waveform = this.element.querySelector('.waveform');
    this.totalLength = this.element.querySelector('.length');
    this.currentTime = this.element.querySelector('.currentTime');
    this.currentSong = null;
    this.id = element.dataset.playerid;
    this.mp3 = element.dataset.mp3 || window.artists[0].mp3;

    window.cached_json = window.cached_json || {};

    this.wavesurfer = WaveSurfer.create({
      container: this.waveform,
      waveColor: color,
      height: height,
      hideScrollbar: true,
      normalize: true,
      pixelRatio: "1",
      progressColor: 'orange',
      barWidth: '2',
      backend: 'MediaElement'
    });

    this.wavesurfer.on('play', this.play.bind(this));
    this.wavesurfer.on('pause', this.pause.bind(this));
    this.wavesurfer.on('ready', this.updateDuration.bind(this));
    this.wavesurfer.on('audioprocess', this.updateTime.bind(this));
    this.wavesurfer.on('seek', this.updateTime.bind(this));
    this.wavesurfer.on('finish', this.finish.bind(this));

    this.load(this.mp3, true);

    window.addEventListener("resize", this.redraw.bind(this));
  }

  play() {
    window.buttons['_global'].setState(true);
    window.buttons[this.currentSong].setState(true);
    this.currentTime.style.display = "block";
    this.totalLength.style.display = "block";
  }

  pause() {
    window.buttons['_global'].setState(false);
    window.buttons[this.currentSong].setState(false);
  }

  stop() {
    this.currentTime.style.display = "none";
    this.totalLength.style.display = "none";
  }

  finish() {
  }

  updateDuration() {
    var time = this.wavesurfer.getDuration();
    var mins = ~~(time / 60);
    var secs = ("0" + ~~(time % 60)).slice(-2);
    this.totalLength.innerHTML = mins + ":" + secs;
  }

  updateTime() {
    var time = this.wavesurfer.getCurrentTime();
    var mins = ~~(time / 60);
    var secs = ("0" + ~~(time % 60)).slice(-2);
    this.currentTime.innerHTML = mins + ":" + secs;
  }

  redraw() {
    var player = this;
    return debounce(function (player) {
      if (player.wavesurfer && !player.wavesurfer.isPlaying()) {
        player.wavesurfer.empty();
        player.wavesurfer.drawBuffer();
      }
    }, 500)
  }

  load(url, prelim, play) {
    var player = this;

    console.log('loading: ' + url);

    if (!window.cached_json[url]) {
      loadJSON(url, function (data, filename) {
        window.cached_json[url] = JSON.parse(data);
        if (!prelim) {
          player.wavesurfer.load(url, window.cached_json[url], "metadata");
          player.currentSong = url;
        } else {
          player.wavesurfer.load("/assets/audio/empty.mp3", window.cached_json[url], "metadata");
        }
        if (play) player.wavesurfer.playPause();
      });
    } else {
      player.wavesurfer.load(url, window.cached_json[url], "metadata");
      player.currentSong = url;
      if (play) player.wavesurfer.playPause();
    }
  }
}