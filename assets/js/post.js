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
        },
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
        play: function (index) {
            return function() {
                player.currentSong = index;
                player.players[index].children[3].style.display = "none";
                player.setPlayButtonState(player.buttons.playPause[index], "playing");
                player.setPlayButtonState(player.playPause[playerIndexes[index]], "paused");
            }
        },
        pause: function (index) {
            return function() {
                player.players[index].children[3].style.display = "block";
                player.setPlayButtonState(player.buttons.playPause[index], "paused");
                player.setPlayButtonState(player.playPause[playerIndexes[index]], "playing");
            }
        },
        stop: function (index) {
            return function() {
                player.players[index].children[3].style.display = "block";
                player.setPlayButtonState(player.buttons.playPause[index], "stopped");
                player.setPlayButtonState(player.playPause[playerIndexes[index]], "really stopped");
            }
        },
        playButtonClick: function(i) {
            return function() {
                if (!jsons[i]){
                    player.load(i, false, function() {
                        player.setCurrentSong(i);
                    });
                } else {
                    player.setCurrentSong(i);
                }
            }
        },
        updateDuration: function (index) {
            return function() {
                var time = wavesurfer[index].getDuration();
                var mins = ~~(time / 60);
                var secs = ("0" + ~~(time % 60)).slice(-2);
                player.length[index].innerHTML = mins + ":" + secs;
            }
        },
        updateTime: function (index) {
            return function() {
                var time = wavesurfer[index].getCurrentTime();
                var mins = ~~(time / 60);
                var secs = ("0" + ~~(time % 60)).slice(-2);
                player.currentTime[index].innerHTML = mins + ":" + secs;
            }
        },
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
        load: function (index, prelim, cb) {

            player.paused = false;

            if (player.players[index].dataset.mp3) {
                loadJSON(player.players[index].dataset.mp3, function(data, filename) {
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
        setCurrentSong: function (index) {
            if (player.currentSong != -1 && index != player.currentSong) {
                wavesurfer[player.currentSong].stop();
                player.stop(player.currentSong)();
            }

            wavesurfer[index].playPause();
            player.currentSong = index;

        },
        attachEventHandlers: function() {
            /* The sidebar artist links */
            Array.prototype.forEach.call(player.artists, function (link, index) {
                link.addEventListener('click', function (e) {
                    sidebarWrapper.classList.remove('in');
                    displayBand(index);
                });
            });
        }
    }

    /* Initialize players */
    for (var i = 0; i < player.players.length; i++) {
            
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

        playerIndexes[i] = player.players[i].dataset.bandindex - 1;

        wavesurfer[i].on('play', player.play(i));
        wavesurfer[i].on('pause', player.pause(i));
        wavesurfer[i].on('ready', player.updateDuration(i));
        wavesurfer[i].on('audioprocess', player.updateTime(i));
        wavesurfer[i].on('seek', player.updateTime(i));
        wavesurfer[i].on('finish', function () {
            player.playButtonClick((player.currentSong + 1) % player.players.length)();
        });

        player.players[i].childNodes[1].addEventListener('click', player.playButtonClick(i));
        player.load(i, true);

    }

    // Map bandnames to indexes for interpretion of hash
    for (i = 0; i < player.artists.length; i++) {
        bandIndexes[player.artists[i].dataset.machinename] = i;
    }
    
    var currentBand = location.hash ? bandIndexes[(location.hash.split('#')[1])] : 0;

    var displayBand = function (index, first) {
        selectedArtist.innerHTML = player.artists[currentBand].dataset.artist;
        blazy.revalidate();
    };

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

    window.addEventListener("resize", player.redraw());

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
    }});

    // Start it up
    player.attachEventHandlers();
};