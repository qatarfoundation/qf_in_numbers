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

    gotoCategory(name) {
        console.log(this._viewManager.active);
        if (!this._viewManager.active || this._viewManager.active.name !== 'Home') return;
        this._viewManager.active.gotoCategory(name);
    },

    gotoSubcategory(index) {
        if (this._viewManager.active.name !== 'Home') return;
        this._viewManager.active.gotoSubcategory(index);
    },
};
