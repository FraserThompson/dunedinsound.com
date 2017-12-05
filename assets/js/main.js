---
---

{% include_relative vendor/intersection-observer.min.js %}
{% include_relative vendor/lozad.min.js %}
{% include_relative vendor/perfect-scrollbar.min.js %}
{% include_relative vendor/smooth-scroll.polyfills.min.js %}
{% include_relative vendor/gumshoe.min.js %}
{% include_relative vendor/bootstrap-native.min.js %}
{% include_relative vendor/isotope.pkgd.min.js %}
{% include_relative vendor/packery-mode.pkgd.min.js%}
{% include_relative vendor/baguetteBox.min.js %}
{% include_relative vendor/wavesurfer.min.js %}
{% include_relative vendor/stickyfill.min.js %}
{% include_relative vendor/lightgallery.min.js %}
{% include_relative vendor/lg-zoom.min.js %}
{% include_relative vendor/lg-thumbnail.js %}

{% include_relative isotope.js %}
{% include_relative searching.js %}
{% include_relative sorting.js %}
{% include_relative gigs.js %}

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

// gets a random int
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Loads JSON from a remote 
function loadJSON (filename, callback) {   

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

// speaks
var speak = debounce(function() {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    
    msg.voiceURI = 'native';
    msg.volume = 1;
    msg.rate = getRandomInt(0, 2);
    msg.pitch = getRandomInt(0, 2);
    msg.text = 'Cool';
    msg.lang = 'en-US';

    speechSynthesis.speak(msg);
}, 500, true);

// this sets up the lazy loading observer
var observer = lozad('.b-lazy', {
    rootMargin: '300px 0px',
    threshold: 0,
    load: function(element) {

        var parent = element.parentNode;

        element.onload = function() {
            setTimeout(function() {
                element.classList.add('b-loaded');
                parent.classList.remove('loading');
            }, 100) // a hard coded delay on image loading? ugh gross who put this here
        }

        if (element.tagName == "IMG") {
            element.src = element.getAttribute('data-src')
        } else if (element.tagName == "DIV") {
            element.style.backgroundImage = "url('" + element.getAttribute('data-src') + "')"
            element.onload(); // for some reason this needs calling manually
        }


    }
});
observer.observe();