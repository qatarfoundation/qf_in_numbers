// Vendor
import { component } from '@/utils/bidello';

// Utils
import Debugger from '@/utils/Debugger';

// Views
import viewsData from '@/webgl/configs/views';

export default class ViewManager extends component() {
    init(options = {}) {
        // Props
        this._active = null;

        // Setup
        this._views = this._createViews();
    }

    destroy() {
        super.destroy();
        this._active = null;
        this._destroyViews();
        this._removeDebugLayers();
    }

    /**
     * Getters
     */
    get active() {
        return this._active?.instance;
    }

    get views() {
        return this._views;
    }

    get viewsData() {
        return this._viewsData;
    }

    /**
     * Public
     */
    get(name) {
        return this._getViewByName(name);
    }

    show(name) {
        const view = this._getViewByName(name);
        if (!view || this._active === view) return;
        this._active = view;
        view.instance.show();
        this._loadRenderSettings(view.data.renderer);
        Debugger?.gotoLayer(name);
    }

    hide(name, callback) {
        const view = this._getViewByName(name);
        if (!view) return;
        view.instance.hide(callback);
    }

    /**
     * Private
     */
    _createViews() {
        const views = [];
        for (const view of viewsData) {
            // Debugger
            Debugger?.addLayer(view.name, 'Views');

            // Instance
            const instance = new view.class({
                config: view,
            });
            instance.name = view.name;

            views.push({
                name: view.name,
                instance,
                data: view,
            });
        }

        return views;
    }

    _getViewByName(name) {
        for (const view of this._views) {
            if (view.name.toLowerCase() === name.toLowerCase()) return view;
        }
        return null;
    }

    _loadRenderSettings(settings) {
        this.$renderer.setClearColor(settings.clearColor);
    }

    _destroyViews() {
        for (const view of this._views) {
            if (typeof view.instance.destroy === 'function') {
                view.instance.destroy();
            }
        }
    }

    _removeDebugLayers() {
        for (let i = 0, len = this._views.length; i < len; i++) {
            Debugger?.removeLayer(this._views[i].name);
        }
    }

    /**
     * Update
     */
    onUpdate({ time, delta }) {
        if (this._active && typeof this._active.instance.update === 'function') {
            this._active.instance.update({ time, delta });
        }
    }
}
