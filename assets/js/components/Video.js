class Video {
    constructor(element) {
        this.element = element;
        this.link = element.dataset.link;
        this.placeholder_content = this.element.querySelector(".placeholder_content");

        this.element.addEventListener('click', this.playVideo.bind(this));
    }

    playVideo(event) {
        event.preventDefault();
        this.placeholder_content.parentNode.removeChild(this.placeholder_content);

        var iframe = document.createElement("iframe");

        var iframe_url = "https://www.youtube.com/embed/" + this.link + "?autoplay=1&rel=0&autohide=1&vq=hd720";

        iframe.setAttribute("id", "youtube_embed");
        iframe.setAttribute("src", iframe_url);
        iframe.setAttribute("frameborder",'0');
        iframe.setAttribute("allowfullscreen", "yes");

        this.element.appendChild(iframe);

    }
}
