---
---

const WAVEFORM_HEIGHT = "50";
const HEADER_HEIGHT = 100;
const WAVEFORM_COLOR = "white";
const DEVICE_WIDTH = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const backToTop = document.getElementById('back-to-top');
const threshold = window.innerHeight * 1.5;
const header = document.getElementsByClassName('gig-header')[0];

// Helpers and components
{% include_relative gig_helpers.js %}
{% include_relative components/Artist.js %}
{% include_relative components/Player.js %}
{% include_relative components/PlayButton.js %}
{% include_relative components/Images.js %}
{% include_relative components/Video.js %}

function gigInit() {
    window.players = window.players || {};
    window.buttons = window.buttons || {};
    window.artists = window.artists || {};

    window.scroll = new SmoothScroll('.smoothscroll', {
        speed: 600,
        offset: HEADER_HEIGHT,
        easing: 'easeInOutCubic',
        before: function() {
            blazy.destroy();
        },
        after: function() {
            blazy.revalidate();
        }
    });

    gumshoe.init({
        selector: '.gumshoe',
        activeClass: 'active',
        offset: HEADER_HEIGHT + 5,
        scrollDelay: false
    });

    /* STICKY ELEMENTS POLYFILL */
    var stickyElements = document.getElementsByClassName('sticky');
    for (var i = stickyElements.length - 1; i >= 0; i--) {
        Stickyfill.add(stickyElements[i]);
    }

    /* IMAGES OBJECT */
    var media = document.getElementsByClassName('gig');
    var images = new Images(media);

    /* ARTIST OBJECTS */
    var artistElements = document.querySelectorAll('.playlist.canonical .playlist-item');
    var audio_index = 1;
    for (var i = 0; i < artistElements.length; i++) {

        var artistObj = new Artist(artistElements[i], 0);
        var previousObj = window.artists[machine_name];
        if (previousObj) previousObj.next = artistObj;
        artistObj.prev = previousObj;

        if (artistObj.audio) {
            artistObj.index = audio_index++;
            if (!window.artists['first']) window.artists['first'] = artistObj;
        }

        var machine_name = artistElements[i].dataset.machinename;
        window.artists[machine_name] = artistObj;
    }

    /* BUTTON OBJECTS */
    var playButtonElements = document.querySelectorAll('button.playButton');
    for (var i = 0; i < playButtonElements.length; i++) {
        var playerid = playButtonElements[i].dataset.playerid;
        var artist = playButtonElements[i].dataset.artist;
        console.log('Initializing a button for: ' + playerid + ' with ' + (artist || 'no artist'));
        window.buttons[artist || '_global'] = new PlayButton(playButtonElements[i]);
    }

    /* PLAYER OBJECTS */
    var playerElements = document.querySelectorAll('div.player');
    for (var i = 0; i < playerElements.length; i++) {
        var playerid = playerElements[i].dataset.playerid;
        console.log('Initializing a player: ' + playerid);
        window.players[playerid] = new Player(playerElements[i], WAVEFORM_COLOR, WAVEFORM_HEIGHT);
    }

    /* VIDEO OBJECTS */
    var videoElements = document.querySelectorAll('.youtube');
    for (var i = 0; i < videoElements.length; i++) {
        new Video(videoElements[i]);
    }

    // select the artist from the URL hash
    if (location.hash) {
        window.artists[(location.hash.split('#')[1])] ? window.artists[(location.hash.split('#')[1])].selectArtist() : false;
    }

    window.addEventListener("scroll", function() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        // Hide and show the header when we scroll to the first artist
        if ((document.documentElement.scrollTop || document.body.scrollTop) > window.artists['first'].container.offsetTop + window.artists['first'].container.offsetHeight - 45){
            header.style.opacity = 1;
        } else {
            header.style.opacity = 0;
        }
    });

    // So the dropdown closes on child click. Annoying, bootstrap should do it for me.
    var dropdownElements = document.querySelectorAll(".dropdown a");
    for (var i = 0; i < dropdownElements.length; i++) {
        dropdownElements[i].onclick = function() {
            document.querySelector(".dropdown").click();
        };
    }
}