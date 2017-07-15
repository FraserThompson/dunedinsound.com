class Artist {
    constructor(element) {
        var self = this;
        this.element = element;
        this.recordings = [];
        this.machine_name = element.dataset.machinename;
        this.name = element.dataset.name;
        this.audio = element.dataset.mp3 ? JSON.parse(element.dataset.mp3) : null;
        this.previous = null;
        this.next = null;
        element.addEventListener('click', function (e) {
            self.displayArtist();
        });
    }

    displayArtist() {
        blazy.revalidate();
    }

    get nextAudio() {
        if (!this.next.audio) {
            return this.next.nextAudio();
        } else {
            return this.next;
        }
    }

    get prevAudio() {
        if (!this.previous.audio) {
            return this.previous.prevAudio();
        } else {
            return this.previous;
        }
    }
}