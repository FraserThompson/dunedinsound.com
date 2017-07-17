class Images {
    constructor(element) {
        this.element = element;
        this.attachGallery();
    }

    attachGallery() {
        for(var i = 0; i < this.element.length; i++) {
            lightGallery(this.element[i], {
                selector: '.item',
                youtubePlayerParams: { modestbranding: 1, showinfo: 0, controls: 1, autoplay: 1, vq: "hd1080", rel: 0 },
                zoom: true
            }); 
        }
    }

}