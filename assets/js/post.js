var post = post || {};

post.waveformInit = function() {
    var threshold = window.innerHeight * 1.5;
    var headerHeight = 60;

    var jsons = {};
    var bandIndexes = {};

    /* DOM Elements */
    var backToTop = document.getElementById('back-to-top');
    var header = document.getElementById('header');
    var navbar = document.getElementById('navigation-wrapper');
    var navbar_brand = document.getElementsByClassName("navbar-brand")[0];
    var selectedArtist = document.getElementById("selectedArtist");
    var sidebarWrapper = document.getElementsByClassName("sidebar-wrapper")[0];

    var player = {
        waveform: document.getElementById('waveform'),
        waveform_wrapper: document.getElementById('waveform_wrapper'),
        length: document.getElementById('length'),
        currentTime: document.getElementById('currentTime'),
        links: document.querySelectorAll('#playlist .playlist-item'),
        currentSong: -1,
        buttons: {
            playPause: document.getElementsByClassName('playButton'),
            play: document.getElementById('play'),
            pause: document.getElementById('pause'),
        },
        play: function (index) {
            player.buttons.playPause[index || player.currentSong].classList.remove("paused");
            player.buttons.playPause[index || player.currentSong].classList.add("playing");
            player.buttons.playPause[index || player.currentSong].children[0].style.display = "none";
            player.buttons.playPause[index || player.currentSong].children[1].style.display = "";
        },
        pause: function (index) {
            player.buttons.playPause[index || player.currentSong].classList.add("paused");
            player.buttons.playPause[index || player.currentSong].children[0].style.display = "";
            player.buttons.playPause[index || player.currentSong].children[1].style.display = "none";
        },
        stop: function (index) {
            player.buttons.playPause[index || player.currentSong].classList.remove("playing");
            player.buttons.playPause[index || player.currentSong].classList.remove("paused");
            player.buttons.playPause[index || player.currentSong].children[0].style.display = "";
            player.buttons.playPause[index || player.currentSong].children[1].style.display = "none";
        },
        updateDuration: function () {
            return function() {
                player.waveform.style.opacity = 1;
                var time = wavesurfer.getDuration();
                var mins = ~~(time / 60);
                var secs = ("0" + ~~(time % 60)).slice(-2);
                player.length.innerHTML = mins + ":" + secs;
            }
        },
        updateTime: function () {
            return function() {
                var time = wavesurfer.getCurrentTime();
                var mins = ~~(time / 60);
                var secs = ("0" + ~~(time % 60)).slice(-2);
                player.currentTime.innerHTML = mins + ":" + secs;
            }
        },
        show: function() {
            player.waveform_wrapper.style.opacity = "1";
            player.currentTime.innerHTML = "";
        },
        hide: function() {
            player.waveform_wrapper.style.opacity = "0";
        },
        redraw: function() {
            return debounce(function() {
                if (!wavesurfer.isPlaying()) {
                    wavesurfer.empty();
                    wavesurfer.drawBuffer();
                }
            }, 500)
        },
        load: function (index, cb) {
            if (!jsons[index]) {
                loadJSON(player.links[index].dataset.mp3, function(data, filename) {
                    jsons[index] = data;
                    wavesurfer.load(filename, JSON.parse(data));
                    cb();
                });
            } else {
                wavesurfer.load(player.links[index].dataset.mp3, JSON.parse(jsons[index]));
                cb();
            }
        },
        setCurrentSong: function (index, dontplay) {

            navbar_brand.classList.add("slim");

            if (!dontplay && index == player.currentSong) {
                wavesurfer.playPause();
                return;
            }

            if (player.currentSong >= 0) player.stop(player.currentSong);
            player.currentSong = index;

            player.load(player.currentSong, function() {
                player.show();
                if (!dontplay) wavesurfer.play();
            });
        },
        attachEventHandlers: function() {

            wavesurfer.on('play', player.play);
            wavesurfer.on('pause', player.pause);
            wavesurfer.on('ready', player.updateDuration());
            wavesurfer.on('audioprocess', player.updateTime());
            wavesurfer.on('seek', player.updateTime());
            wavesurfer.on('finish', function () {
                player.setCurrentSong((player.currentSong + 1) % player.links.length);
            });

            Array.prototype.forEach.call(player.buttons.playPause, function (button, index) {
                button.addEventListener('click', function (e) {
                    player.setCurrentSong(index);
                });
            });

            Array.prototype.forEach.call(player.links, function (link, index) {
                link.addEventListener('click', function (e) {
                    displayBand(index);
                });
            });
        }
    }

    var wavesurfer = WaveSurfer.create({
        container: player.waveform,
        waveColor: 'orange',
        height: "60",
        hideScrollbar: true,
        normalize: true,
        pixelRatio: "1",
        progressColor: '#BCFA88',
        barWidth: '2',
        backend: 'MediaElement'
    })

    // Map bandnames to indexes
    for (i = 0; i < player.links.length; i++) {
        bandIndexes[player.links[i].dataset.machinename] = i;
    }

    // Map photo counts to bands
    var photoIndexes = [];
    for (i = 0; i < player.links.length; i++ ){
        photoIndexes[i] = parseInt(player.links[i].dataset.numberofphotos);
        if (i > 0) {
            j = i - 1;
            do {
                photoIndexes[i] = photoIndexes[i] + parseInt(photoIndexes[j]);
                j = j - 1;
            } while(j > 0)
        }
    }

    var currentBand = location.hash ? bandIndexes[(location.hash.split('#')[1])] : 0;

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


    /* Updates the DOM when a new band is selected */
    var displayBand = function (index, first) {

        // hide the old
        player.links[currentBand].classList.remove('active');
        var photos = document.getElementById(player.links[currentBand].dataset.machinename + "_photo");
        if (photos) { photos.style.display = "none"; }
        var videos = document.getElementById(player.links[currentBand].dataset.machinename + "_video")
        if (videos) { videos.style.display = "none"; }

        currentBand = index;
        
        // show the player by default if no photos
        if (player.links[currentBand].dataset.numberofphotos == 0) {
            player.setCurrentSong(currentBand, true);
        } else if (first) {
            player.load(currentBand, function() {});
        }
        // show the new
        player.links[currentBand].classList.add('active');
        var photos = document.getElementById(player.links[currentBand].dataset.machinename + "_photo")
        if (photos) { photos.style.display = "block"; }
        var videos = document.getElementById(player.links[currentBand].dataset.machinename + "_video")
        if (videos) { videos.style.display = "block"; }

        selectedArtist.innerHTML = player.links[currentBand].dataset.artist;

        blazy.revalidate();
    };

    window.addEventListener("scroll", function() {

        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        if ((document.documentElement.scrollTop || document.body.scrollTop) > (headerHeight)){
            sidebarWrapper.classList.add("scrolled");
        } else {
            sidebarWrapper.classList.remove("scrolled"); 
        }

    });

    window.addEventListener("resize", player.redraw());

    // Setup the lightbox thing
    baguetteBox.run('.pic', { onChange: function(currentIndex, imagesCount) {
        // if (currentIndex == photoIndexes[currentBand]) {
        //     displayBand(currentBand + 1)
        // } else if (currentIndex < photoIndexes[parseInt(currentBand) - 1]) {
        //     displayBand(currentBand - 1)
        // }
    }});

    // Start it up
    player.attachEventHandlers();
    displayBand(currentBand, true);
};