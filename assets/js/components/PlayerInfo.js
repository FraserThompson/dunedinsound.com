class PlayerInfo {
    constructor(element) {
        this.element = element;
        this.current = element.querySelector('#nowPlaying');
        this.next = element.querySelector('#playingNext');
    }

    update(current, next) {
        this.current.innerHTML = current;
        this.next.innerHTML = next;
    }
}