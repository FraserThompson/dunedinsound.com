---
---

{% include_relative components/Player.js %}
{% include_relative components/PlayButton.js %}

const WAVEFORM_HEIGHT = "50";
const HEADER_HEIGHT = 60;
const WAVEFORM_COLOR = "white";

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

var players = [];
var buttons = [];

// make an object for each player (there's only one right now)
var playerElements = document.querySelectorAll('div.player');
for (var i = 0; i < playerElements.length; i++) {
    players.push(new Player(playerElements[i], WAVEFORM_COLOR, WAVEFORM_HEIGHT));
}

// make an object for each button (todo: handle global button, handle resetting all other playbutton states when switching songs);
var playButtonElements = document.querySelectorAll('button.playButton:not(.big)');
for (var i = 0; i < playButtonElements.length; i++) {
    buttons.push(new PlayButton(playButtonElements[i], players[0])); // all buttons refer to the global play right now
}