var post = post || {};

post.waveformInit = function() {
    var DEBUG = false;
    var threshold = window.innerHeight * 1.5;

    var jsons = {};
    var bandIndexes = {};

    /* DOM Elements */
    var backToTop = document.getElementById('back-to-top');
    var header = document.getElementById('header');
    var navbar = document.getElementById('navigation-wrapper');
    var nav_wrapper = document.getElementById("wrapper");
    var menu_toggle = document.getElementById("menu-toggle");

    var player = {
        waveform: document.getElementById('waveform'),
        waveform_wrapper: document.getElementById('waveform_wrapper'),
        length: document.getElementById('length'),
        currentTime: document.getElementById('currentTime'),
        links: document.querySelectorAll('#playlist a'),
        play: function () {
            return function() {
                buttons.play.style.display = 'none';
                buttons.pause.style.display = '';
            }
        },
        pause: function () {
            return function() {
                buttons.play.style.display = '';
                buttons.pause.style.display = 'none';
            }
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
                player.currentTime.innerHTML = mins + ":" + secs + "/";
            }
        },
        show: function() {
            buttons.playPause.style.display = "block";
            player.waveform_wrapper.style.opacity = "1";
            player.currentTime.innerHTML = "";
        },
        hide: function() {
            buttons.playPause.style.display = "none";
            buttons.download.style.opacity = "0";
            player.waveform_wrapper.style.opacity = "0";
        },
        redraw: function() {
            return debounce(function() {
                if (!wavesurfer.isPlaying()) {
                    wavesurfer.empty();
                    wavesurfer.drawBuffer();
                }
            }, 500)
        }
    }

    var wavesurfer = WaveSurfer.create({
        container: player.waveform,
        waveColor: 'violet',
        height: "75",
        hideScrollbar: true,
        normalize: true,
        pixelRatio: "1",
        progressColor: '#BCFA88',
        barWidth: '2',
        backend: 'MediaElement'
    })

    var buttons = {
        playPause: document.getElementById('playPause'),
        download: document.getElementById('downloadButton'),
        facebook: document.getElementById('facebookButton'),
        bandcamp: document.getElementById('bandcampButton'),
        moreFromArtist: document.getElementById('moreFromArtist'),
        play: document.getElementById('play'),
        pause: document.getElementById('pause'),
        artist: document.getElementById('artistButton')
    }

    // Map bandnames to indexes
    for (i = 0; i < player.links.length; i++) {
        bandIndexes[player.links[i].dataset.machinename] = i;
    }

    var currentTrack = location.hash ? bandIndexes[(location.hash.split('#')[1])] : 0;

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

    // Scrolls the sidebar so the selected gig is on the screen
    var scrollToGig = function () {
        var gigLinkTop = document.getElementsByClassName('active')[1].getBoundingClientRect().top;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        if (gigLinkTop > windowHeight - 120) {
            navbar.scrollTop = gigLinkTop;
            Ps.update(container);
        }
    }

    /* Updates the DOM when a new song if selected */
    var setCurrentSong = function (index, play) {

        if (DEBUG) { console.log ('Setting current song to ' + index) }

        /* images */
        // hide the old
        player.links[currentTrack].classList.remove('active');
        var photos = document.getElementById(player.links[currentTrack].dataset.machinename + "_photo");
        if (photos) { photos.style.display = "none"; }
        var videos = document.getElementById(player.links[currentTrack].dataset.machinename + "_video")
        if (videos) { videos.style.display = "none"; }

        currentTrack = index;

        // show the new
        player.links[currentTrack].classList.add('active');
        var photos = document.getElementById(player.links[currentTrack].dataset.machinename + "_photo")
        if (photos) { photos.style.display = "block"; }
        var videos = document.getElementById(player.links[currentTrack].dataset.machinename + "_video")
        if (videos) { videos.style.display = "block"; }

        blazy.revalidate();

        /* social links */
        var facebook = player.links[currentTrack].dataset.facebook;
        var bandcamp = player.links[currentTrack].dataset.bandcamp;
        var otherGigs = player.links[currentTrack].dataset.numberofgigs > 1;

        if (!facebook && !bandcamp && !otherGigs) {
            buttons.moreFromArtist.style.display = "none";
        } else {
            buttons.moreFromArtist.style.display = "block";
            if (facebook) {
                buttons.facebook.style.display = "block";
                buttons.facebook.href = facebook;
            } else {
                buttons.facebook.style.display = "none";
            }

            if (bandcamp) {
                buttons.bandcamp.style.display = "block";
                buttons.bandcamp.href = bandcamp;
            } else {
                buttons.bandcamp.style.display = "none";
            }

            if (otherGigs) {
                buttons.artist.style.display = "block";
                buttons.artist.href = "/artists/" + player.links[currentTrack].dataset.machinename;
            } else {
                buttons.artist.style.display = "none";
            }
        }

        /* audio */
        // if they have an mp3
        if (player.links[currentTrack].dataset.mp3) {

            // Download button
            if (player.links[currentTrack].dataset.nodownload != "true") {
                buttons.download.style.opacity = "1";
                buttons.download.href = player.links[currentTrack].dataset.mp3;
            } else {
                buttons.download.style.opacity = "0";
            }
             
            if (!jsons[currentTrack]) {

                loadJSON(player.links[currentTrack].dataset.mp3, function(data, filename) {
                    jsons[currentTrack] = data;
                    
                    if (DEBUG) { console.log ('Downloaded JSON for :' + player.links[currentTrack].dataset.mp3); }

                    player.show();

                    wavesurfer.load(filename, JSON.parse(data));
                    if (play) { 
                        setTimeout(function() {
                            wavesurfer.play(); 
                            history.pushState(null, null, '#' + player.links[currentTrack].dataset.machinename ); 
                        }, 1000);
                    };
                });

            } else {     

                player.show();
                wavesurfer.load(player.links[currentTrack].dataset.mp3, JSON.parse(jsons[currentTrack]));
                if (play) {
                    setTimeout(function() {
                        wavesurfer.play(); 
                        history.pushState(null, null, '#' + player.links[currentTrack].dataset.machinename ); 
                    }, 1000);
                };

            }
        } else {
            if (DEBUG) { console.log ('No MP3, hiding player.'); }
            player.hide();
        }

    };

    /* event listeners */
    wavesurfer.on('play', player.play());
    wavesurfer.on('pause', player.pause());
    wavesurfer.on('ready', player.updateDuration());
    wavesurfer.on('audioprocess', player.updateTime());
    wavesurfer.on('seek', player.updateTime());
    wavesurfer.on('finish', function () {
        setCurrentSong((currentTrack + 1) % player.links.length, true);
    });

    buttons.playPause.addEventListener('click', function (e) {
        wavesurfer.playPause();
    });

    Array.prototype.forEach.call(player.links, function (link, index) {
        link.addEventListener('click', function (e) {
            //e.preventDefault();
            if (window.innerWidth < 1200) {
                nav_wrapper.classList.toggle("toggled");
                menu_toggle.classList.toggle("toggled");
            }
            setCurrentSong(index, false);
        });
    });

    window.addEventListener("scroll", function() {

        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        if ((document.documentElement.scrollTop || document.body.scrollTop) > 200){
            header.classList.add('dimmed');
            player.waveform_wrapper.classList.add('dimmed');
        } else {
            header.classList.remove('dimmed');
            player.waveform_wrapper.classList.remove('dimmed');
        }
    });

    window.addEventListener("resize", player.redraw());

    // Start it up
    scrollToGig();
    setCurrentSong(currentTrack, false);
};