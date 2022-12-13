class Anchors {
    constructor() {
        this._anchors = [];
    }

    add(anchor) {
        this._anchors.push(anchor);
    }

    get(id) {
        return this._anchors.find(anchor => anchor.id === id);
    }
}

export default new Anchors();
