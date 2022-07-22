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

    transitionIn() {
        if (this.isHome()) {
            return this._viewManager.active.transitionIn();
        }
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

    gotoSubcategory(categoryId, subcategoryId) {
        if (this.isHome()) {
            this._viewManager.active.gotoSubcategory(categoryId, subcategoryId);
        }
    },

    gotoEntity(categoryId, entityId) {
        if (this.isHome()) {
            return this._viewManager.active.gotoEntity(categoryId, entityId);
        }
    },

    isMovingToEntity() {
        return this.isHome() && this._viewManager.active._movingToEntity;
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

    enableIdleRotation() {
        this._idleRotation = true;
    },

    disableMouseRotation() {
        this._mouseRotation = false;
    },

    enableMouseRotation() {
        this._mouseRotation = true;
    },

    disableIdleRotation() {
        if (this._idleRotation) this._viewManager.active.resetTreeRotation?.();
        this._idleRotation = false;
    },

    categoryMouseEnter(name) {
        if (this.isHome()) {
            this._viewManager.active.categoryMouseEnter(name);
        }
    },

    categoryMouseLeave(name) {
        if (this.isHome()) {
            this._viewManager.active.categoryMouseLeave(name);
        }
    },
};
