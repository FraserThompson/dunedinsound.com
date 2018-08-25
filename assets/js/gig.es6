---
---

// Prerequisites
{% include_relative vendor/wavesurfer.min.js %}
{% include_relative vendor/wavesurfer.regions.min.js %}

const WAVEFORM_HEIGHT = "58";
const HEADER_HEIGHT = 90;
const WAVEFORM_COLOR = "white";
const DEVICE_WIDTH = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const backToTop = document.getElementById('back-to-top');
const threshold = window.innerHeight * 1.5;
const header = document.getElementsByClassName('gig-header')[0];
const gigTitleWrapper = document.getElementsByClassName('gig-title-wrapper')[0];
const banner = document.getElementsByClassName('post-header')[0];
const dropdownMenu = document.getElementsByClassName('dropdown')[0];

// Components
{% include_relative components/gig/Artist.js %}
{% include_relative components/gig/Player.js %}
{% include_relative components/gig/PlayButton.js %}
{% include_relative components/gig/Images.js %}
{% include_relative components/gig/Video.js %}

function gigInit() {
    window.players = window.players || {};
    window.buttons = window.buttons || {};
    window.artists = window.artists || {};

    window.scroll = new SmoothScroll('.canonical .smoothscroll', {
        speed: 600,
        offset: HEADER_HEIGHT,
        easing: 'easeInOutCubic'
    });

    gumshoe.init({
        selector: '.gumshoe',
        activeClass: 'active',
        offset: HEADER_HEIGHT + 60,
        scrollDelay: false
    });

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
    var playButtonElements = document.querySelectorAll('.playHandler');
    for (var i = 0; i < playButtonElements.length; i++) {

        var playerid = playButtonElements[i].dataset.playerid;
        var artist = playButtonElements[i].dataset.artist;
        var time = playButtonElements[i].dataset.time;

        console.log('Initializing a button for: ' + playerid + ' with ' + (artist || 'no artist'));

        window.buttons[time ? artist + time : artist || '_global'] = new PlayButton(playButtonElements[i]);
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

    // select the artist from the URL hash or just select the first one
    if (location.hash) {
        window.artists[(location.hash.split('#')[1])] ? window.artists[(location.hash.split('#')[1])].selectArtist() : false;
    } else if (window.artists['first']) {
        window.artists['first'].selectArtist();
    }

    window.addEventListener("scroll", function() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        // Hide and show the header when we scroll to the first artist
        if ((document.documentElement.scrollTop || document.body.scrollTop) > (banner.offsetTop + banner.offsetHeight) - 30){
            header.classList.add("scrolled");
            gigTitleWrapper.style.opacity = 1;
            dropdownMenu.style.opacity = 1;
        } else {
            header.classList.remove("scrolled");
            gigTitleWrapper.style.opacity = 0;
            dropdownMenu.style.opacity = 0;
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