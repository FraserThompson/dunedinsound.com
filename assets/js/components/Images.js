class Images {
    constructor(element) {
        this.element = element;
        this.attachGallery();
    }

    attachGallery() {
        for(var i = 0; i < this.element.length; i++) {
            lightGallery(this.element[i], {
                selector: '.item',
                loadYoutubeThumbnail: true,
                youtubeThumbSize: 'default',
                videoMaxWidth: DEVICE_WIDTH * 0.7,
                youtubePlayerParams: { modestbranding: 1, showinfo: 0, controls: 1, vq: "hd1080", rel: 0 },
                zoom: true
            }); 
        }
    }

}