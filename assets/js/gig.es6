---
---

{% include_relative gig_helpers.js %}

{% include_relative components/PlayerInfo.js %}
{% include_relative components/Artist.js %}
{% include_relative components/Player.js %}
{% include_relative components/PlayButton.js %}

const WAVEFORM_HEIGHT = "50";
const HEADER_HEIGHT = 60;
const WAVEFORM_COLOR = "white";
const backToTop = document.getElementById('back-to-top');
const threshold = window.innerHeight * 1.5;

window.players = window.players || {};
window.buttons = window.buttons || {};
window.artists = window.artists || {};
window.playerInfo = new PlayerInfo(document.getElementById('now_playing_wrapper'));

var artistElements = document.querySelectorAll('#playlist .playlist-item');
for (var i = 0; i < artistElements.length; i++) {

    var artistObj = new Artist(artistElements[i]);
    var previousObj = window.artists[machine_name];
    if (previousObj) previousObj.next = artistObj;
    artistObj.prev = previousObj;

    var machine_name = artistElements[i].dataset.machinename;
    window.artists[machine_name] = artistObj;

    if (!window.artists['first'] && artistObj.links) window.artists['first'] = artistObj;

}

var currentArtist = location.hash ? window.artists[(location.hash.split('#')[1])] : window.artists['first'];
currentArtist.displayArtist();

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
