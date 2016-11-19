 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/assets/output.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 var getPeaks = function(wavesurfer, element) {
    return function() {
        var peaks = wavesurfer.backend.getPeaks(2048);
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(peaks));
        var filename = element.dataset.mp3.split('/');

        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = filename[filename.length -1 ] + '.json';
        a.innerHTML = 'download JSON';

        element.appendChild(a);
    }
}

var waveforms = document.getElementsByClassName('waveforms');
var wavesurfer = [];

for (var i = 0; i < waveforms.length; i++) {
    wavesurfer.push(WaveSurfer.create({
        container: '#' + waveforms[i].id,
        waveColor: 'violet',
        hideScrollbar: "true",
        pixelRatio: "1",
        progressColor: '#BCFA88',
        barWidth: '2',
        backend: 'MediaElement'
    }))

    var filename = waveforms[i].dataset.mp3.split('/');

    wavesurfer[i].load('/assets/mp3/' + filename[filename.length - 1]);

    wavesurfer[i].on('seek', getPeaks(wavesurfer[i], waveforms[i]));
}