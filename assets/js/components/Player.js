class Player {

  constructor(element, color, height) {
    this.element = element;
    this.waveform = this.element.querySelector('.waveform');
    this.totalLength = this.element.querySelector('.length');
    this.currentTime = this.element.querySelector('.currentTime');
    this.currentSong = null;

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
    this.wavesurfer.on('ready', this.updateDuration.bind(this));
    this.wavesurfer.on('audioprocess', this.updateTime.bind(this));
    this.wavesurfer.on('seek', this.updateTime.bind(this));
    this.wavesurfer.on('finish', function () {
      // if ((player.currentSong + 1) <= player.players.length) {
      //     player.playButtonClick(player.currentSong + 1)();
      // } else {
      //     player.stop(player.currentSong);
      // }
    });

    this.load(this.element.dataset.mp3, true);

    window.addEventListener("resize", this.redraw());
  }

  play() {
    this.currentTime.style.display = "block";
    this.totalLength.style.display = "block";
  }

  stop() {
    this.currentTime.style.display = "none";
    this.totalLength.style.display = "none";
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

    this.paused = false;

    console.log('loading: ' + url);

    if (!window.cached_json[url]) {

      console.log('no cache, downloading');

      loadJSON(url, function (data, filename) {

        window.cached_json[url] = JSON.parse(data);
        console.log('downloaded');

        if (!prelim) {
          player.wavesurfer.load(url, window.cached_json[url], "metadata");
          player.currentSong = url;
        } else {
          player.wavesurfer.load("/assets/audio/empty.mp3", window.cached_json[url], "metadata");
        }

        if (play) player.wavesurfer.playPause();
      });
    } else {
      console.log('found cache for it');
      player.wavesurfer.load(url, window.cached_json[url], "metadata");
      player.currentSong = url;
      if (play) player.wavesurfer.playPause();
    }

  }

  setCurrentSong(index) {
    if (this.currentSong != -1 && index != this.currentSong) {
      this.wavesurfer.stop();
      this.stop()();
    }
  }
}