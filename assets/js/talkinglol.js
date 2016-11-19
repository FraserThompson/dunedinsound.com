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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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