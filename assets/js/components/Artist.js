class Artist {
    constructor(element) {
        var self = this;
        this.element = element;
        this.mp3 = element.dataset.mp3;

        element.addEventListener('click', function (e) {
            self.displayArtist();
        });
    }

    displayArtist() {
        blazy.revalidate();
    }
}