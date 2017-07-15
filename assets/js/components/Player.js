class Player {

  constructor(element, color, height) {
    this.element = element;
    this.id = element.dataset.playerid;
    this.waveform = this.element.querySelector('.waveform');
    this.totalLength = this.element.querySelector('.length');
    this.currentTime = this.element.querySelector('.currentTime');
    this.currentSong = null;
    this.currentArtist = null;
    this.prelim = false; // indicates whether the current loaded track is just an empty mp3 (use to determine whether to go to the next song on finish)

    window.cached_json = window.cached_json || {};

    this.wavesurfer = WaveSurfer.create({
      container: this.waveform,
      waveColor: color,
      height: height,
      hideScrollbar: true,
      normalize: true,
      pixelRatio: "1",
      backend: "MediaElement",
      progressColor: 'orange',
      barWidth: '2'
    });

    this.wavesurfer.on('play', this.play.bind(this));
    this.wavesurfer.on('pause', this.pause.bind(this));
    this.wavesurfer.on('ready', this.updateDuration.bind(this));
    this.wavesurfer.on('audioprocess', this.updateTime.bind(this));
    this.wavesurfer.on('seek', this.updateTime.bind(this));
    this.wavesurfer.on('finish', this.finish.bind(this));

    this.loadArtist(window.artists[element.dataset.artist] || window.artists['first'], true);
    if (window.playerInfo) window.playerInfo.update(this.currentArtist.name, this.currentArtist.nextAudio.name);

    window.addEventListener("resize", this.redraw.bind(this)());
  }

  play() {
    window.buttons['_global'].setState(true);
    window.buttons[this.currentArtist.machine_name].setState(true);
    this.currentTime.style.display = "block";
    this.totalLength.style.display = "block";
  }

  pause() {
    window.buttons['_global'].setState(false);
    window.buttons[this.currentArtist.machine_name].setState(false);
  }

  stop() {
    this.currentTime.style.display = "none";
    this.totalLength.style.display = "none";
  }

  finish() {
    if (!this.prelim) {
      this.next();
    }
  }

  next() {
    if (this.currentArtist.links.length - 1 > this.currentSong) {
      this.currentSong = this.currentSong + 1;
      this.loadMp3(this.currentArtist.links[this.currentSong], false, true);
    } else {
      this.currentArtist = this.currentArtist.nextAudio;
      if (window.playerInfo) window.playerInfo.update(this.currentArtist.name, this.currentArtist.nextAudio.name);
      this.loadArtist(this.currentArtist, false, true);
    }
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
    return debounce(function () {
      console.log('redrawing');
      if (this.wavesurfer && !this.wavesurfer.isPlaying()) {
        this.wavesurfer.empty();
        this.wavesurfer.drawBuffer();
      }
    }, 250).bind(this)
  }

  loadArtist(artist, prelim, play, trackIndex) {
    this.currentArtist = artist;
    this.loadMp3(this.currentArtist.links[trackIndex || 0], prelim, play);
    this.currentSong = trackIndex || 0;
  }

  loadMp3(url, prelim, play) {
    var player = this;

    this.prelim = prelim;

    console.log('loading: ' + url);

    if (!window.cached_json[url]) {
      loadJSON(url, function (data, filename) {
        window.cached_json[url] = JSON.parse(data);
        if (!prelim) {
          player.wavesurfer.load(url, window.cached_json[url], "metadata");
        } else {
          player.wavesurfer.load("/assets/audio/empty.mp3", window.cached_json[url], "metadata");
        }
        if (play) player.wavesurfer.playPause();
      });
    } else {
      player.wavesurfer.load(url, window.cached_json[url], "metadata");
      if (play) player.wavesurfer.playPause();
    }
  }
}