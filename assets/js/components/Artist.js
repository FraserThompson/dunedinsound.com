class Artist {
    constructor(element) {
        var self = this;
        this.element = element;
        this.recordings = [];
        this.machine_name = element.dataset.machinename;
        this.name = element.dataset.name;
        this.links = element.dataset.mp3 ? element.dataset.mp3.split('^') : null;
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
        if (!this.next.links) {
            return this.next.nextAudio();
        } else {
            return this.next;
        }
    }

    get prevAudio() {
        if (!this.previous.links) {
            return this.previous.prevAudio();
        } else {
            return this.previous;
        }
    }
}