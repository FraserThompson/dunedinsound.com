class PlayButton {

    constructor(element) {
        this.element = element;
        this.id = element.dataset.playerid;
        this.artist = window.artists[element.dataset.artist] || null;
        this.time = element.dataset.time || null;
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
                if (this.element.classList.contains('playButton')){
                    this.element.querySelector('.play').style.display = "";
                    this.element.querySelector('.pause').style.display = "none";
                }
                break;
        }
    }

    playPause() {
        this.log("Received click for " + this.artist.name);

        if (window.players[this.id].prelim || window.players[this.id].currentArtist != this.artist) {

            this.log("Loading new artist... prelim=" + window.players[this.id].prelim + " player artist=" + window.players[this.id].currentArtist + " button artist=" + this.artist);

            window.players[this.id].loadArtist(this.artist, false, true, null, function() {

                // seek if there's a time
                setTimeout(function(){
                    if (this.time) window.players[this.id].seekToTime(this.time)
                }.bind(this), 500)

            }.bind(this));;

        } else {

            if (this.time) {
                window.players[this.id].seekToTime(this.time);
                window.players[this.id].wavesurfer.play();
            } else {
                window.players[this.id].wavesurfer.playPause();
            }

        }
    }

    globalPlayPause() {
        if (window.players[this.id].prelim) {
            this.log("Loading artist again because prelim was " + window.players[this.id].prelim);
            window.players[this.id].loadArtist(window.players[this.id].currentArtist, false, true);
        } else {
            window.players[this.id].wavesurfer.playPause();
        }
    }

    clickHandler() {
        if (this.artist) {
            this.log("Received click for " + this.artist.name);
            this.playPause();
        } else {
            this.log("Received click for global PlayButton");
            this.globalPlayPause();
        }
    }

    log(string) {
        console.log("PlayButton " + this.id + ": " + string);
    }
}