class Artist {
    constructor(element, index) {

        this.element = element;
        this.recordings = [];
        this.machine_name = element.dataset.machinename;
        this.name = element.dataset.name;
        this.container = document.getElementById(this.machine_name);
        this.index = index;
        this.audio = element.dataset.mp3 ? JSON.parse(element.dataset.mp3) : null;
        this.prev = null;
        this.next = null;

        element.addEventListener('click', function (e) {
            this.displayArtist();
        }.bind(this));

        this.select_element = document.querySelectorAll('.' + this.machine_name + '-select');
        for (var i = 0; i < this.select_element.length; i++) {
            this.select_element[i].addEventListener('click', this.selectArtist.bind(this));
        }
    }

    displayArtist() {
    }

    selectArtist() {
        this.displayArtist();
        if (this.audio && !window.players["_global"].wavesurfer.isPlaying()) {
            window.players["_global"].loadArtist(this);
        }
    }

    nextAudio() {
        if (!this.next) {
            return null;
        } else if (!this.next.audio) {
            return this.next.nextAudio();
        } else if (this.next) {
            return this.next;
        }
    }

    prevAudio() {
        if (!this.prev) {
            return null;
        } else if (!this.prev.audio) {
            return this.prev.nextAudio();
        } else if (this.prev) {
            return this.prev;
        }
    }
}