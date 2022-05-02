export default {
    start() {
        this._start();
    },

    /**
     * Views
     */
    showView(name) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        this._viewManager.show(name);
    },

    isHome() {
        return this._viewManager.active && this._viewManager.active.name === 'Home';
    },

    gotoOverview() {
        if (this.isHome()) {
            this._viewManager.active.gotoOverview();
        }
    },

    gotoCategory(name) {
        if (this.isHome()) {
            this._viewManager.active.gotoCategory(name);
        }
    },

    gotoSubcategory(name) {
        if (this.isHome()) {
            this._viewManager.active.gotoSubcategory(name);
        }
    },

    gotoEntity(name) {
        if (this.isHome()) {
            this._viewManager.active.gotoEntity(name);
        }
    },
};
