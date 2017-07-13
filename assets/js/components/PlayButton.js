class PlayButton {

    constructor(element, player) {
        this.element = element;
        this.player = player;
        this.playing = false;
        this.mp3 = element.dataset.mp3;
        this.element.addEventListener('click', this.click.bind(this));
    }

    setState(state) {
        switch (state) {
            case true:
                this.playing = true;
                this.element.classList.remove("paused");
                this.element.classList.add("playing");
                this.element.querySelector('.play').style.display = "none";
                this.element.querySelector('.pause').style.display = "";
                break;
            case false:
                this.playing = false;
                this.element.classList.remove("playing");
                this.element.classList.remove("paused");
                this.element.querySelector('.play').style.display = "";
                this.element.querySelector('.pause').style.display = "none";
                break;
        }
    }

    click() {
        if (this.player.currentSong != this.mp3) {
            this.player.load(this.mp3, false, true);
        } else {
            this.player.wavesurfer.playPause();
        }
        this.setState(!this.playing);
    }

}