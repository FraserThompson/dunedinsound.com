class Artist {
    constructor(element, index) {

        this.element = element;
        this.recordings = [];
        this.machine_name = element.dataset.machinename;
        this.name = element.dataset.name;
        this.index = index;
        this.audio = element.dataset.mp3 ? JSON.parse(element.dataset.mp3) : null;
        this.prev = null;
        this.next = null;

        element.addEventListener('click', function (e) {
            this.displayArtist();
        }.bind(this));
    }

    displayArtist() {
        blazy.revalidate();
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