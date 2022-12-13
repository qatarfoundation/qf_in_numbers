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

    transitionIn(props) {
        if (this.isHome()) {
            return this._viewManager.active.transitionIn(props);
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

    gotoEntity(categoryId, subcategoryId, entityId) {
        if (this.isHome()) {
            return this._viewManager.active.gotoEntity(categoryId, subcategoryId, entityId);
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

    selectCategory(name) {
        if (this.isHome()) {
            this._viewManager.active.selectCategory(name);
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

    updateBranchInteractivity(categories) {
        if (this.isHome()) {
            this._viewManager.active.updateBranchInteractivity(categories);
        }
    },
};
