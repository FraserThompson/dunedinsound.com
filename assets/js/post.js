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
    const WAVEFORM_COLOR = "#cccccc";

    var threshold = window.innerHeight * 1.5;

    var jsons = {}; // for caching the json files we get
    var playerIndexes = [];
    var bandIndexes = {}; // mapping machine names to index numbers
    var photoIndexes = []; // counting photos for each band
    var wavesurfer = []; // all the wavesurfer objects

    /* General DOM Elements */
    var backToTop = document.getElementById('back-to-top');
    var navbar_brand = document.getElementsByClassName("navbar-brand")[0];
    var selectedArtist = document.getElementById("selectedArtist");
    var sidebarWrapper = document.getElementsByClassName("sidebar-wrapper")[0];

    /* Player methods and elements */
    var player = {
        waveforms: document.getElementsByClassName('waveform'),
        players: document.getElementsByClassName('player'),
        length: document.getElementsByClassName('length'),
        currentTime: document.getElementsByClassName('currentTime'),
        artists: document.querySelectorAll('#playlist .playlist-item'),
        currentSong: -1,
        playPause: document.getElementsByClassName('play-pause'),
        buttons: {
            playPause: document.getElementsByClassName('playButton'),
            universalPlayButton: document.getElementById('universalPlayButton')
        },
        /* 
        Sets the state of a play button
        Params: element to set, state to set it to
        */
        setPlayButtonState: function (element, state) {
            if (state == "playing") {
                element.classList.remove("paused");
                element.classList.add("playing");
                element.children[0].style.display = "none";
                element.children[1].style.display = "";
            } else if (state == "paused") {
                element.classList.add("paused");
                element.children[0].style.display = "";
                element.children[1].style.display = "none";
            } else if (state == "stopped") {
                element.classList.remove("playing");
                element.classList.remove("paused");
                element.children[0].style.display = "";
                element.children[1].style.display = "none"; 
            } else if (state == "really stopped") {
                element.classList.remove("playing");
                element.classList.remove("paused");
                element.children[0].style.display = "none";
                element.children[1].style.display = "none"; 
            }
        },
        /* 
        Sets the current song and the state of the DOM items when playing. Called whenever wavesurfer plays.
        Params: index of the player to play.
        */
        play: function (index) {
            return function() {
                var state = "playing";
                player.currentSong = index;
                player.players[index].children[1].style.display = "block"; // current time
                player.players[index].children[3].style.display = "none"; // title overlay
                player.players[index].children[4].style.display = "block"; // total length
                player.setPlayButtonState(player.buttons.playPause[index], state);
                player.setPlayButtonState(player.buttons.universalPlayButton, state);
                player.setPlayButtonState(player.playPause[playerIndexes[index]], "paused");
            }
        },
        /* 
        Sets the state of the DOM items when paused. Called whenever wavesurfer pauses.
        Params: index of the player to pause.
        */
        pause: function (index) {
            return function() {
                var state = "paused";
                player.players[index].children[3].style.display = "block";
                player.setPlayButtonState(player.buttons.playPause[index], state);
                player.setPlayButtonState(player.buttons.universalPlayButton, state);
                player.setPlayButtonState(player.playPause[playerIndexes[index]], "playing");
            }
        },
        /* 
        Sets the state of the DOM items when stopped. Called whenever wavesurfer stops.
        Params: index of the player to stop.
        */
        stop: function (index) {
            return function() {
                var state = "stopped"
                player.players[index].children[1].style.display = "none"; // current time
                player.players[index].children[3].style.display = "block"; // title overlay
                player.players[index].children[4].style.display = "none"; // total length
                player.setPlayButtonState(player.buttons.playPause[index], state);
                player.setPlayButtonState(player.buttons.universalPlayButton, state);
                player.setPlayButtonState(player.playPause[playerIndexes[index]], "really stopped");
            }
        },
        /* 
        Updates the duration as it plays.
        Params: index of the player to update.
        */
        updateDuration: function (index) {
            return function() {
                var time = wavesurfer[index].getDuration();
                var mins = ~~(time / 60);
                var secs = ("0" + ~~(time % 60)).slice(-2);
                player.length[index].innerHTML = mins + ":" + secs;
            }
        },
        /* 
        Updates the total time of a player.
        Params: index of the player to update.
        */
        updateTime: function (index) {
            return function() {
                var time = wavesurfer[index].getCurrentTime();
                var mins = ~~(time / 60);
                var secs = ("0" + ~~(time % 60)).slice(-2);
                player.currentTime[index].innerHTML = mins + ":" + secs;
            }
        },
        /* 
        Redraws all players. Called on browser resize.
        */
        redraw: function() {
            return debounce(function() {
                for (var i = 0; i < wavesurfer.length; i++) {
                    if (wavesurfer[i] && !wavesurfer[i].isPlaying()) {
                        wavesurfer[i].empty();
                        wavesurfer[i].drawBuffer();
                    }
                }
            }, 500)
        },
        /* 
        Loads a song into a player. Downloads JSON if necessary. 
        Params: Index of the player, if prelim is set it'll just load the JSON and an empty mp3, cb is the callback
        */
        load: function (index, prelim, cb) {

            this.paused = false;

            if (this.players[index].dataset.mp3) {
                loadJSON(this.players[index].dataset.mp3, function(data, filename) {
                    if (!prelim) {
                        wavesurfer[index].load(filename, JSON.parse(data), "metadata");
                        jsons[index] = true;
                    } else {
                        wavesurfer[index].load("/assets/audio/empty.mp3", JSON.parse(data), "metadata");
                        jsons[index] = false;
                    }
                    if (cb) cb();
                });
            }
        },
        /* 
        Loads the song into the player and calls setCurrentSong() on it. Called when a play button is clicked.
        Params: index of the song to play
        */
        playButtonClick: function(i, universal) {
            return function() {
                var index = universal ? (player.currentSong != -1 ? player.currentSong : 0) : i;
                if (!jsons[index]){
                    player.load(index, false, function() {
                        player.setCurrentSong(index);
                    });
                } else {
                    player.setCurrentSong(index);
                }
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

            wavesurfer[index].playPause();
        }
    }

    /* Initialize players */
    for (var i = 0; i < player.players.length; i++) {
        
        // Create the object
        wavesurfer[i] = WaveSurfer.create({
            container: player.waveforms[i],
            waveColor: WAVEFORM_COLOR,
            height: WAVEFORM_HEIGHT,
            hideScrollbar: true,
            normalize: true,
            pixelRatio: "1",
            progressColor: 'orange',
            barWidth: '2',
            backend: 'MediaElement'
        });

        // Map the band index to the player index
        playerIndexes[i] = player.players[i].dataset.bandindex - 1;

        wavesurfer[i].on('play', player.play(i));
        wavesurfer[i].on('pause', player.pause(i));
        wavesurfer[i].on('ready', player.updateDuration(i));
        wavesurfer[i].on('audioprocess', player.updateTime(i));
        wavesurfer[i].on('seek', player.updateTime(i));
        wavesurfer[i].on('finish', function () {
            if ((player.currentSong + 1) <= player.players.length) {
                player.playButtonClick(player.currentSong + 1)();
            } else {
                player.stop(player.currentSong);
            }
        });

        // Add event listeners to the play button
        player.players[i].childNodes[1].addEventListener('click', player.playButtonClick(i));

        // Load the JSON waveform into the player
        player.load(i, true);

    }

    /* Listener for the universal play button */
    if (player.buttons.universalPlayButton) {
        player.buttons.universalPlayButton.addEventListener('click', player.playButtonClick(null, true));
    }

    /* Map bandnames to indexes for interpretion of the URL hash */
    for (i = 0; i < player.artists.length; i++) {
        bandIndexes[player.artists[i].dataset.machinename] = i;
    }
    
    /* Obtain the current band from the URL or set it to 0 */
    var currentBand = location.hash ? bandIndexes[(location.hash.split('#')[1])] : 0;

    /* Switches to a band. Used on clicking the sidebar links. */
    var displayBand = function (index, first) {
        selectedArtist.innerHTML = player.artists[currentBand].dataset.artist;
        blazy.revalidate();
    };

    /* The sidebar artist links */
    Array.prototype.forEach.call(player.artists, function (link, index) {
        link.addEventListener('click', function (e) {
            sidebarWrapper.classList.remove('in');
            displayBand(index);
        });
    });

    /* Redraw the players on resize */
    window.addEventListener("resize", player.redraw());

    /* Scroll stuff */
    window.addEventListener("scroll", function() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    smoothScroll.init({
        selector: '.playlist-item',
        speed: 500,
        selectorHeader: '.header',
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
        selectorHeader: '.header',
        activeClass: 'active',
        offset: +10,
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