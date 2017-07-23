class Player {

  constructor(element, color, height) {
    this.element = element;
    this.id = element.dataset.playerid;
    this.waveform = this.element.querySelector('.waveform');

    this.totalLength = this.element.querySelector('.length');
    this.currentTime = this.element.querySelector('.currentTime');
    this.loadingProgress = this.element.querySelector('.progress-bar');

    this.nextButton = this.element.querySelector('.nextButton');
    this.prevButton = this.element.querySelector('.prevButton');

    this.titleWrapper = this.element.querySelector('.title-wrapper');
    this.currentArtistElement = this.element.querySelectorAll('.currentArtist');
    this.currentSongElement = this.titleWrapper.querySelector('.currentSong');

    this.currentSong = null;
    this.currentArtist = null;
    this.nextArtist = null;
    this.prelim = false; // indicates whether the current loaded track is just an empty mp3 (use to determine whether to go to the next song on finish)

    window.cached_json = window.cached_json || {};

    this.wavesurfer = WaveSurfer.create({
      container: this.waveform,
      waveColor: color,
      height: height,
      hideScrollbar: true,
      normalize: true,
      pixelRatio: "1",
      forceDecode: false,
      backend: "MediaElement",
      progressColor: 'orange',
      barWidth: '2'
    });

    this.wavesurfer.on('play', this.play.bind(this));
    this.wavesurfer.on('pause', this.pause.bind(this));
    this.wavesurfer.on('audioprocess', this.updateTime.bind(this));
    this.wavesurfer.on('seek', this.seek.bind(this));
    this.wavesurfer.on('ready', this.ready.bind(this));
    this.wavesurfer.on('finish', this.finish.bind(this));
    this.wavesurfer.on('loading', this.loading.bind(this)); //this doesn't work for some reason but it's here anyway

    this.loadArtist(window.artists[element.dataset.artist] || window.artists['first'], true);

    // window.addEventListener("resize", this.redraw.bind(this)());

  }

  play() {
    this.element.classList.add('active');
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
      this.next(true);
    }
  }

  loading(percents) {
      this.loadingProgress.value = percents;
      this.loadingProgress.style.width = percents + "%";
  }

  seek(progress) {
    if (this.prelim) {
      // If we're on empty.mp3 then load the real and and then seek
      this.loadMp3(this.currentArtist.audio[this.currentSong].url, false, false, function() {

        setTimeout(function() {
          this.wavesurfer.seekTo(progress);
        }.bind(this), 100)

      }.bind(this));
    } else {
      this.updateTime();
    }
  }

  ready() {
    setTimeout(function() {
      this.updateTitle();
      this.updateTime();
      this.updateDuration();
      this.loadingProgress.style.display = "none";
    }.bind(this), 100)
  }

  next(play) {
    if (this.currentArtist.audio.length - 1 > this.currentSong) {
      this.currentSong = this.currentSong + 1;
      this.loadMp3(this.currentArtist.audio[this.currentSong].url, false, play);
    } else if (this.nextArtist) {
      this.currentArtist = this.nextArtist;
      this.loadArtist(this.currentArtist, false, play);
    }
  }

  prev(play) {
    if (this.currentArtist.audio.length - 1 < this.currentSong) {
      this.currentSong = this.currentSong - 1;
      this.loadMp3(this.currentArtist.audio[this.currentSong].url, false, play);
    } else if (this.prevArtist) {
      this.currentArtist = this.prevArtist;
      this.loadArtist(this.currentArtist, false, play);
    }
  }

  nextClickHandler(event) {
    event.preventDefault();
    this.next(false);
  }

  prevClickHandler(event) {
    event.preventDefault();
    this.prev(false);
  }

  updateDuration() {
    var time = this.wavesurfer.getDuration();
    var mins = ~~(time / 60);
    var secs = ("0" + ~~(time % 60)).slice(-2);
    if (mins == 0 && secs == 0) {
      this.totalLength.display = "none";
    } else {
      this.totalLength.display = "block";
      this.totalLength.innerHTML = mins + ":" + secs;
    }
  }

  updateTime() {
    var time = this.wavesurfer.getCurrentTime();
    var mins = ~~(time / 60);
    var secs = ("0" + ~~(time % 60)).slice(-2);
    if (mins == 0 && secs == 0) {
      this.currentTime.display = "none";
    } else {
      this.currentTime.display = "block";
      this.currentTime.innerHTML = mins + ":" + secs;
    }
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
    this.nextArtist = this.currentArtist.next ? this.currentArtist.nextAudio() : null;
    this.prevArtist = this.currentArtist.prev ? this.currentArtist.prevAudio() : null;
    this.loadMp3(this.currentArtist.audio[trackIndex || 0].url, prelim, play);
    this.currentSong = trackIndex || 0;
  }

  updateTitle() {
    for (var i = 0; i < this.currentArtistElement.length; i++) {
      this.currentArtistElement[i].innerHTML = this.currentArtist.index + '. ' + this.currentArtist.name;
    }
    this.currentSongElement.innerHTML = this.currentArtist.audio[this.currentSong].name
  }

  loadMp3(url, prelim, play, cb) {
    this.prelim = prelim;

    this.loadingProgress.style.display = "block"

    console.log('loading: ' + url + ' and prelim is ' + prelim);

    if (!window.cached_json[url]) {
      loadJSON(url, function (data, filename) {
        window.cached_json[url] = JSON.parse(data);
        if (!prelim) {
          this.wavesurfer.load(url, window.cached_json[url], "metadata");
        } else {
          this.wavesurfer.load("/assets/audio/empty.mp3", window.cached_json[url], "metadata");
        }
        if (play) this.wavesurfer.playPause();
        if (cb) cb();
      }.bind(this));
    } else {
      this.wavesurfer.load(url, window.cached_json[url], "metadata");
      if (play) this.wavesurfer.playPause();
      if (cb) cb();
    }
  }
}