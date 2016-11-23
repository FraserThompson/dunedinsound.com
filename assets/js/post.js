var post = post || {};

post.waveformInit = function() {

    var threshold = window.innerHeight * 1.5;
    var backToTop = document.getElementById('back-to-top');
    var header = document.getElementById('header');

    var jsons = {};
    var bandIndexes = {};

    var player = {
        waveform: document.getElementById('waveform'),
        waveform_wrapper: document.getElementById('waveform_wrapper'),
        legacy: document.getElementById('player'),
        length: document.getElementById('length'),
        currentTime: document.getElementById('currentTime'),
        links: document.querySelectorAll('#playlist a')
    }
    
    for (i = 0; i < player.links.length; i++) {
        bandIndexes[player.links[i].dataset.machinename] = i;
    }

    var currentTrack = location.hash ? bandIndexes[(location.hash.split('#')[1])] : 0;

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

    var scrollToGig = function () {
        var container = document.getElementById('navigation-wrapper');
        var gigLinkTop = document.getElementsByClassName('active')[1].getBoundingClientRect().top;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        if (gigLinkTop > windowHeight - 120) {
            console.log('scrolling to: ' + gigLinkTop);
            container.scrollTop = gigLinkTop;
            Ps.update(container);
        }
    }

    scrollToGig();

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

    var play = function () {
        return function() {
            buttons.play.style.display = 'none';
            buttons.pause.style.display = '';
        }
    };

    var pause = function () {
        return function() {
            buttons.play.style.display = '';
            buttons.pause.style.display = 'none';
        }
    };

    var updateDuration = function () {
        return function() {
            player.waveform.style.opacity = 1;
            var time = wavesurfer.getDuration();
            var mins = ~~(time / 60);
            var secs = ("0" + ~~(time % 60)).slice(-2);
            player.length.innerHTML = mins + ":" + secs;
        }
    };

    var updateTime = function () {
        return function() {
            var time = wavesurfer.getCurrentTime();
            var mins = ~~(time / 60);
            var secs = ("0" + ~~(time % 60)).slice(-2);
            player.currentTime.innerHTML = mins + ":" + secs + "/";
        }
    }

    var setCurrentSong = function (index, play) {

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

        if (player.links[currentTrack].dataset.mp3) {

            buttons.download.href = player.links[currentTrack].dataset.mp3;
        
            // if we've already fetched the json 
            if (jsons[currentTrack]) {
                player.legacy.style.display = "none";
                player.waveform_wrapper.style.opacity = "1";
                buttons.playPause.style.display = "block";
                player.currentTime.innerHTML = "";

                wavesurfer.load(player.links[currentTrack].dataset.mp3, JSON.parse(jsons[currentTrack]));
                if (play) {
                    setTimeout(function() {
                        wavesurfer.play(); 
                        history.pushState(null, null, '#' + player.links[currentTrack].dataset.machinename ); 
                    }, 1000);
                };
            } else {
                loadJSON(player.links[currentTrack].dataset.mp3, function(data, filename) {
                    if (data) {
                        jsons[currentTrack] = data;
                        player.legacy.style.display = "none";
                        buttons.playPause.style.display = "block";
                        player.waveform_wrapper.style.opacity = "1";
                        player.currentTime.innerHTML = "";

                        wavesurfer.load(filename, JSON.parse(data));
                        if (play) { 
                            setTimeout(function() {
                                wavesurfer.play(); 
                                history.pushState(null, null, '#' + player.links[currentTrack].dataset.machinename ); 
                            }, 1000);
                        };
                    } else {
                        buttons.playPause.style.display = "none";
                        player.waveform_wrapper.style.opacity = "0";
                        player.legacy.style.display = "inline-block";

                        var s = document.createElement("source");
                        s.type = "audio/mpeg";
                        s.src = player.links[currentTrack].dataset.mp3;
                        s.innerHTML = null;
                        player.legacy.innerHTML = "";
                        player.legacy.appendChild(s);
                    }
                });
            }
        } else {
            buttons.playPause.style.display = "none";
            buttons.download.style.display = "none";
            player.waveform_wrapper.style.opacity = "0";
        }

    };

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
    });

    wavesurfer.on('play', play());
    wavesurfer.on('pause', pause());
    wavesurfer.on('ready', updateDuration());
    wavesurfer.on('audioprocess', updateTime());
    wavesurfer.on('seek', updateTime());
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
                document.getElementById("wrapper").classList.toggle("toggled");
                document.getElementById("menu-toggle").classList.toggle("toggled");
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

    var redraw = debounce(function() {
        if (!wavesurfer.isPlaying()) {
            wavesurfer.empty();
            wavesurfer.drawBuffer();
        }
    }, 500)

    window.addEventListener("resize", redraw);

    setCurrentSong(currentTrack, false);
};