/* helper functions */

/**
 * Debounces a function so it'll only be run a sensible amount of times per second
 */ 
function debounce(func, wait, immediate) {
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

/**
 * Converts a time string like 1:23:00 or 05:34 to seconds
 */
function timeToSeconds(str) {

    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

/**
 * Random RGBA color.
 */
function randomColor(alpha) {
    return (
        'rgba(' +
        [
            ~~(Math.random() * 255),
            ~~(Math.random() * 255),
            ~~(Math.random() * 255),
            alpha || 1
        ] +
        ')'
    );
}

/**
 * Random integer between a range
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Loads a JSON from somewhere via XMLHttpRequest()
 */
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

var speak = debounce(function(message) {

    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();

    msg.voiceURI = 'native';
    msg.volume = 1;
    msg.rate = getRandomInt(0, 2);
    msg.pitch = getRandomInt(0, 2);
    msg.text = message;
    msg.lang = 'en-US';

    speechSynthesis.speak(msg);

}, 500)

/**
 * The callback which happens when images are loaded
 */
function onImageLoad() {
    this.classList.add('b-loaded');
    this.parentNode.classList.remove('loading');
}

/**
 * Sets up the lazy loading observer
 */
var observer = lozad('.b-lazy', {
    rootMargin: '500px 0px',
    threshold: 0.1,
    load: function(element) {

        element.onload = onImageLoad;

        if (element.tagName == "IMG") {
            element.src = element.getAttribute('data-src')
        } else if (element.tagName == "DIV") {
            element.style.backgroundImage = "url('" + element.getAttribute('data-src') + "')"
            element.onload(); // for some reason this needs calling manually
        }
    }
});

observer.observe();

/* STICKY ELEMENTS POLYFILL */
var stickyElements = document.getElementsByClassName('sticky');
for (var i = stickyElements.length - 1; i >= 0; i--) {
    Stickyfill.add(stickyElements[i]);
}