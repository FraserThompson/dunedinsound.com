class Images {
    constructor(element) {
        this.element = element;
        this.attachGallery();
    }

    attachGallery() {
        for(var i = 0; i < this.element.length; i++) {
            lightGallery(this.element[i], {
                selector: '.item',
                zoom: true,
                preload: 3,
                exThumbImage: 'data-thumbnail'
            });
        }
    }

}