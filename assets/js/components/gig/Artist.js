class Artist {
    constructor(element, index) {

        this.element = element;
        this.recordings = [];
        this.machine_name = element.dataset.machinename;
        this.name = element.dataset.name;
        this.container = document.getElementById(this.machine_name);
        this.index = index;
        this.audio = element.dataset.mp3 ? JSON.parse(element.dataset.mp3) : null;
        this.tracklist = element.dataset.tracklist ? JSON.parse(element.dataset.tracklist) : null;
        this.prev = null;
        this.next = null;

        this.select_elements = document.querySelectorAll('.' + this.machine_name + '-select');
        for (var i = 0; i < this.select_elements.length; i++) {
            this.select_elements[i].addEventListener('click', this.selectArtist.bind(this));
        }
    }

    play() {
        for (var i = 0; i < this.select_elements.length; i++) {
            if (this.select_elements[i].querySelector('.play')) {
                this.select_elements[i].querySelector('.play').style.display = "";
                this.select_elements[i].querySelector('.pause').style.display = "none";
            }
        }
    }

    pause() {
        for (var i = 0; i < this.select_elements.length; i++) {
            if (this.select_elements[i].querySelector('.play')) {
                this.select_elements[i].querySelector('.play').style.display = "none";
                this.select_elements[i].querySelector('.pause').style.display = "";
            }
        }   
    }   
    
    stop() {
        for (var i = 0; i < this.select_elements.length; i++) {
            if (this.select_elements[i].querySelector('.play')) {
                this.select_elements[i].querySelector('.play').style.display = "none";
                this.select_elements[i].querySelector('.pause').style.display = "none";
            }
        }   
    }

    selectArtist() {
        if (this.audio && !window.players["_global"].wavesurfer.isPlaying()) {
            this.log("Selected");
            window.players["_global"].loadArtist(this, true, false);
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

    log(string) {
        console.log("Artist " + this.name + ": " + string);
    }
}