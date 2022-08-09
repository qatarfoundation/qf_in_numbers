class Cursor {
    constructor() {
        // Props
        this._state = 'auto';
    }

    /**
     * Public
     */
    pointer() {
        this._state = 'pointer';
        this._updateCSS();
    }

    auto() {
        this._state = 'auto';
        this._updateCSS();
    }

    /**
     * Private
     */
    _updateCSS() {
        document.body.style.cursor = this._state;
    }
}

export default new Cursor();
