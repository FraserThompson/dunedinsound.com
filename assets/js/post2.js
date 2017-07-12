var post = post || {};

/* helper functions */
// Debounces a function so it'll only be run a sensible amount of times per second
var debounce = function (func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Loads JSON from a remote 
var loadJSON = function (filename, callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");

    xobj.open('GET', filename + ".json", true);

    xobj.onload = function() {
            var status = xobj.status;
            if (status == 200) {
            callback(xobj.responseText, filename);
            } else {
            console.log(status);
            callback(null);
            }
    };

    xobj.onerror = function() {
        callback(null);
    }
    
    xobj.send(null);
};

post.waveformInit = function() {
    const WAVEFORM_HEIGHT = "50";
    const HEADER_HEIGHT = 60;
    const WAVEFORM_COLOR = "white";

    var threshold = window.innerHeight * 1.5;

    var jsons = {}; // for caching the json files we get
    var photoIndexes = []; // counting photos for each band

    /* General DOM Elements */
    var backToTop = document.getElementById('back-to-top');
    var selectedArtist = document.getElementById("selectedArtist");

    var artists = {
        elements: document.querySelectorAll('#playlist .playlist-item'),
        cached_json: {},
        bandIndexes: {},
        // Switches to a band. Used on clicking the sidebar links.
        displayBand: function (index) {
            this.currentBand = index;
            selectedArtist.innerHTML = this.elements[this.currentBand].dataset.artist;
            blazy.revalidate();
        },
        init: function() {
            
            // Map bandnames to indexes for interpretion of the URL hash
            for (var i = 0; i < this.elements.length; i++) {
                this.bandIndexes[this.elements[i].dataset.machinename] = i;
            }
            
            // Obtain the current band from the URL or set it to 0
            this.currentBand = location.hash ? this.bandIndexes[(location.hash.split('#')[1])] : 0;

            /* Artist links */
            Array.prototype.forEach.call(this.elements, function (link, index) {
                link.addEventListener('click', function (e) {
                    artists.displayBand(index);
                });
            });

            this.displayBand(this.currentBand);
        }
    }

    var playButton = {
        element: document.getElementById('universalPlayButton'),
        elements: document.getElementsByClassName('playButton'),
        /* 
        Sets the state of a play button
        Params: element to set, state to set it to
        */
        setPlayButtonState: function (state) {
            console.log(state);
            if (state == "playing") {
                this.element.classList.remove("paused");
                this.element.classList.add("playing");
                this.element.querySelector('.play').style.display = "none";
                this.element.querySelector('.pause').style.display = "";
            } else if (state == "paused") {
                this.element.classList.add("paused");
                this.element.querySelector('.play').style.display = "";
                this.element.querySelector('.pause').style.display = "none";
            } else if (state == "stopped") {
                this.element.classList.remove("playing");
                this.element.classList.remove("paused");
                this.element.querySelector('.play').style.display = "";
                this.element.querySelector('.pause').style.display = "none"; 
            } else if (state == "really stopped") {
                this.element.classList.remove("playing");
                this.element.classList.remove("paused");
                this.element.querySelector('.play').style.display = "none";
                this.element.querySelector('.pause').style.display = "none"; 
            }
        },
        /* 
        Loads the song into the player and calls setCurrentSong() on it. Called when a play button is clicked.
        Params: index of the song to play
        */
        click: function(event) {
            var source = event.target || event.srcElement;

            if (player.currentSong != source.dataset.mp3) {
                player.nowPlaying.innerHTML = source.dataset.bandname;
                player.load(source.dataset.mp3, false, function() {
                    player.wavesurfer.playPause();
                });
            } else {
                player.wavesurfer.playPause();
            }
        },
        init: function() {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].addEventListener('click', playButton.click);
            }
        }
    }

    /* Player methods and elements */
    var player_element = document.querySelector('.header .player');
    var player = {
        wavesurfer: null,
        waveform: player_element.querySelector('.waveform'),
        totalLength: player_element.querySelector('.length'),
        currentTime: player_element.querySelector('.currentTime'),
        nowPlaying: document.getElementById('nowPlaying'),
        playingNext: document.getElementById('#layingNext'),
        currentSong: null,
        /* 
        Sets the current song and the state of the DOM items when playing. Called whenever wavesurfer plays.
        Params: index of the player to play.
        */
        play: function () {
            var state = "playing";
            player.currentTime.style.display = "block";
            player.totalLength.style.display = "block";
            playButton.setPlayButtonState(state);
        },
        /* 
        Sets the state of the DOM items when paused. Called whenever wavesurfer pauses.
        Params: index of the player to pause.
        */
        pause: function () {
            var state = "paused";
            playButton.setPlayButtonState(state);

        },
        /* 
        Sets the state of the DOM items when stopped. Called whenever wavesurfer stops.
        Params: index of the player to stop.
        */
        stop: function () {
            var state = "stopped"
            player.currentTime.style.display = "none";
            player.totalLength.style.display = "none";
            playButton.setPlayButtonState(state);
        },
        /* 
        Updates the duration as it plays.
        Params: index of the player to update.
        */
        updateDuration: function () {
            var time = player.wavesurfer.getDuration();
            var mins = ~~(time / 60);
            var secs = ("0" + ~~(time % 60)).slice(-2);
            player.totalLength.innerHTML = mins + ":" + secs;
        },
        /* 
        Updates the total time of a player.
        Params: index of the player to update.
        */
        updateTime: function () {
            var time = player.wavesurfer.getCurrentTime();
            var mins = ~~(time / 60);
            var secs = ("0" + ~~(time % 60)).slice(-2);
            player.currentTime.innerHTML = mins + ":" + secs;
        },
        /* 
        Redraws all players. Called on browser resize.
        */
        redraw: function() {
            return debounce(function() {
                if (player.wavesurfer && !player.wavesurfer.isPlaying()) {
                    player.wavesurfer.empty();
                    player.wavesurfer.drawBuffer();
                }
            }, 500)
        },
        /* 
        Loads a song into a player. Downloads JSON if necessary. 
        Params: URL of MP3 file, if prelim is set it'll just load the JSON and an empty mp3, cb is the callback
        */
        load: function (url, prelim, cb) {

            this.paused = false;

            console.log('loading: ' + url);

            if (!artists.cached_json[url]) {

                console.log('no cache, downloading');

                loadJSON(url, function(data, filename) {
                    
                    artists.cached_json[url] = JSON.parse(data);
                    console.log('downloaded');

                    if (!prelim) {
                        player.wavesurfer.load(url, artists.cached_json[url], "metadata");
                        player.currentSong = url;
                    } else {
                        player.wavesurfer.load("/assets/audio/empty.mp3", artists.cached_json[url], "metadata");
                    }

                    if (cb) cb();
                });
            } else {
                console.log('found cache for it');
                player.wavesurfer.load(url, artists.cached_json[url], "metadata");
                player.currentSong = url;
                if (cb) cb();
            }

        },
        /* 
        Sets the current song and plays it.
        Params: index of the song to play
        */
        setCurrentSong: function (index) {
            if (this.currentSong != -1 && index != this.currentSong) {
                wavesurfer[player.currentSong].stop();
                this.stop(this.currentSong)();
            }
        },
        init: function() {
            player.wavesurfer = WaveSurfer.create({
                container: player.waveform,
                waveColor: WAVEFORM_COLOR,
                height: WAVEFORM_HEIGHT,
                hideScrollbar: true,
                normalize: true,
                pixelRatio: "1",
                progressColor: 'orange',
                barWidth: '2',
                backend: 'MediaElement'
            });

            player.wavesurfer.on('play', player.play);
            player.wavesurfer.on('pause', player.pause);
            player.wavesurfer.on('ready', player.updateDuration);
            player.wavesurfer.on('audioprocess', player.updateTime);
            player.wavesurfer.on('seek', player.updateTime);
            player.wavesurfer.on('finish', function () {
                // if ((player.currentSong + 1) <= player.players.length) {
                //     player.playButtonClick(player.currentSong + 1)();
                // } else {
                //     player.stop(player.currentSong);
                // }
            });

            // Load the JSON waveform into the player
            player.load(player_element.dataset.mp3, true);
            
            // Redraw the players on resize
            window.addEventListener("resize", player.redraw());

        }
    }

    /* Scroll stuff */
    window.addEventListener("scroll", function() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    player.init();
    playButton.init();
    artists.init();

    smoothScroll.init({
        selector: '.playlist-item',
        speed: 500,
        easing: 'easeInOutCubic',
        before: function() {
            blazy.destroy();
        },
        after: function() {
            blazy.revalidate();
        }
    });

    gumshoe.init({
        selector: '.playlist-item',
        activeClass: 'active',
        offset: 0,
        scrollDelay: false,
        callback: function (nav) {
            if (nav) selectedArtist.innerHTML = nav.nav.dataset.artist;
        }
    });

    /* Lightbox stuff */
    baguetteBox.run('.gig-media', {onChange: function (currentIndex) {

        var lightbox = document.getElementById('baguetteBox-figure-' + currentIndex);
        var img = lightbox.getElementsByTagName('img')[0]

        var youtube_embed = document.getElementById("youtube_container");
        if (youtube_embed) youtube_embed.parentNode.removeChild(youtube_embed);

        if (img.alt != "image") {

            img.style.display = "block";

            var container = document.createElement("div");
            var iframe = document.createElement("iframe");

            var iframe_url = "https://www.youtube.com/embed/" + img.alt + "?autoplay=1&autohide=1&vq=hd720";

            iframe.setAttribute("id", "youtube_embed");
            iframe.setAttribute("src", iframe_url);
            iframe.setAttribute("frameborder",'0');
            iframe.setAttribute("allowfullscreen", "yes");

            container.setAttribute("id", "youtube_container");

            img.style.display = "none"
            
            container.appendChild(iframe);
            lightbox.appendChild(container);
        }

    }, afterHide: function() {
        var youtube_embed = document.getElementById("youtube_container");
        if (youtube_embed) youtube_embed.outerHTML = "";
    }, captions: function(element) {
        var img = element.getElementsByTagName('img')[0];

        if (img.alt == "image") {
            var taken =  "Taken at " + img.dataset.date;
            var download = "<a href='" + img.dataset.downloadlink + "' download>Download</a>";
            return "<p>" + img.dataset.artist + ": " + taken + " " + download + "</p>";
        } else {
            return null;
        }
    }});

};