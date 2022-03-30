export default {
    start() {
        this._start();
    },

    /**
     * Views
     */
    showView(name) {
        this._viewManager.show(name);
    },
};
