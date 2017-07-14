class PlayButton {

    constructor(element) {
        this.element = element;
        this.id = element.dataset.playerid;
        this.mp3 = element.dataset.mp3 || null;
        this.playing = false;
        this.element.addEventListener('click', this.clickHandler.bind(this));
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

    playPause() {
        if (window.players[this.id].currentSong != this.mp3) {
            window.players[this.id].load(this.mp3, false, true);
        } else {
            window.players[this.id].wavesurfer.playPause();
        }
    }

    globalPlayPause() {
        if (!window.players[this.id].currentSong) {
            window.players[this.id].load(window.players[this.id].mp3, false, true);
        } else {
            window.players[this.id].wavesurfer.playPause();
        }
    }

    clickHandler() {
        if (this.mp3) {
            this.playPause();
        } else {
            this.globalPlayPause();
        }
    }

}