---
---

const WAVEFORM_HEIGHT = "50";
const HEADER_HEIGHT = 100;
const WAVEFORM_COLOR = "white";
const DEVICE_WIDTH = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const backToTop = document.getElementById('back-to-top');
const threshold = window.innerHeight * 1.5;

// Helpers and components
{% include_relative gig_helpers.js %}
{% include_relative components/Artist.js %}
{% include_relative components/Player.js %}
{% include_relative components/PlayButton.js %}
{% include_relative components/Images.js %}

function gigInit() {
    window.players = window.players || {};
    window.buttons = window.buttons || {};
    window.artists = window.artists || {};

    var stickyElements = document.getElementsByClassName('sticky');
    for (var i = stickyElements.length - 1; i >= 0; i--) {
        Stickyfill.add(stickyElements[i]);
    }

    var media = document.getElementsByClassName('gig-media');
    var images = new Images(media);

    // Make an object for each artist
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

    // make an object for each button
    var playButtonElements = document.querySelectorAll('button.playButton');
    for (var i = 0; i < playButtonElements.length; i++) {
        var playerid = playButtonElements[i].dataset.playerid;
        var artist = playButtonElements[i].dataset.artist;
        console.log('Initializing a button for: ' + playerid + ' with ' + (artist || 'no artist'));
        window.buttons[artist || '_global'] = new PlayButton(playButtonElements[i]);
    }

    // make an object for each player (there's only one right now)
    var playerElements = document.querySelectorAll('div.player');
    for (var i = 0; i < playerElements.length; i++) {
        var playerid = playerElements[i].dataset.playerid;
        console.log('Initializing a player: ' + playerid);
        window.players[playerid] = new Player(playerElements[i], WAVEFORM_COLOR, WAVEFORM_HEIGHT);
    }

    // select the artist from the URL hash
    if (location.hash) {
        window.artists[(location.hash.split('#')[1])] ? window.artists[(location.hash.split('#')[1])].displayArtist() : false;
    }

    window.addEventListener("scroll", function() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > threshold){
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    smoothScroll.init({
        selector: '.playlist-item.smoothscroll',
        speed: 500,
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
        selector: '.playlist-item.gumshoe',
        activeClass: 'active',
        offset: HEADER_HEIGHT + 5,
        scrollDelay: false
    });

    // So the dropdown closes on child click. Annoying, bootstrap should do it for me.
    var dropdownElements = document.querySelectorAll(".dropdown a");
    for (var i = 0; i < dropdownElements.length; i++) {
        dropdownElements[i].onclick = function() {
            document.querySelector(".dropdown").click();
        };
    }

    // baguetteBox.run('.gig-media', {onChange: function (currentIndex) {

    //     var lightbox = document.getElementById('baguetteBox-figure-' + currentIndex);
    //     var img = lightbox.getElementsByTagName('img')[0]

    //     var youtube_embed = document.getElementById("youtube_container");
    //     if (youtube_embed) youtube_embed.parentNode.removeChild(youtube_embed);

    //     if (img.alt != "image") {

    //         img.style.display = "block";

    //         var container = document.createElement("div");
    //         var iframe = document.createElement("iframe");

    //         var iframe_url = "https://www.youtube.com/embed/" + img.alt + "?autoplay=1&autohide=1&vq=hd720";

    //         iframe.setAttribute("id", "youtube_embed");
    //         iframe.setAttribute("src", iframe_url);
    //         iframe.setAttribute("frameborder",'0');
    //         iframe.setAttribute("allowfullscreen", "yes");

    //         container.setAttribute("id", "youtube_container");

    //         img.style.display = "none"
            
    //         container.appendChild(iframe);
    //         lightbox.appendChild(container);
    //     }

    // }, afterHide: function() {
    //     var youtube_embed = document.getElementById("youtube_container");
    //     if (youtube_embed) youtube_embed.outerHTML = "";
    // }, captions: function(element) {
    //     var img = element.getElementsByTagName('img')[0];

    //     if (img.alt == "image") {
    //         var taken =  "Taken at " + img.dataset.date;
    //         var download = "<a href='" + img.dataset.downloadlink + "' download>Download</a>";
    //         return "<p>" + img.dataset.artist + ": " + taken + " " + download + "</p>";
    //     } else {
    //         return null;
    //     }
    // }});

}