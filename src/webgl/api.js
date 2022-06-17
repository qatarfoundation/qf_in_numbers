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

    gotoCategory(slug) {
        if (this.isHome()) {
            this._viewManager.active.gotoCategory(slug);
        }
    },

    gotoSubcategory(categorySlug, name) {
        if (this.isHome()) {
            this._viewManager.active.gotoSubcategory(categorySlug, name);
        }
    },

    gotoEntity(categorySlug, slug) {
        if (this.isHome()) {
            const categorySlugSplit = categorySlug.split('/').slice(-1)[0];
            const centitySlugSplit = slug.split('/').slice(-1)[0];
            this._viewManager.active.gotoEntity(categorySlugSplit, centitySlugSplit);
        }
    },

    selectEntity(entity, category) {
        if (this.isHome()) {
            this._viewManager.active.selectEntity(entity, category);
        }
    },

    hideCurrentEntity() {
        if (this.isHome()) {
            this._viewManager.active.hideCurrentEntity();
        }
    },

    enableInteractions() {
        this._isInteractive = true;
    },

    disableInteractions() {
        this._isInteractive = false;
    },

    showTree() {
        if (this.isHome()) {
            return this._viewManager.active.showTree();
        }
    },
};
