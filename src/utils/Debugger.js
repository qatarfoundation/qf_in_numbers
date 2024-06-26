// Utils
import EventDispatcher from '@/utils/EventDispatcher';
import isBrowser from '@/utils/isBrowser';

// Vendor
let DDDD = null;

class Debugger extends EventDispatcher {
    constructor() {
        super();
        this._create();
    }

    /**
     * Public
     */
    addLayer(label, group) {
        return this._dddd.addLayer(label, group);
    }

    removeLayer(label) {
        this._dddd.removeLayer(label);
    }

    gotoLayer(label) {
        this._dddd.gotoLayer(label);
    }

    addGroup(label, options) {
        return this._dddd.addGroup(label, options);
    }

    removeGroup(label) {
        return this._dddd.removeGroup(label);
    }

    add(object, property, options) {
        this._dddd.add(object, property, options);
    }

    addButton(label, options) {
        this._dddd.addButton(label, options);
    }

    /**
     * Private
     */
    _create() {
        if (DDDD && !this._dddd) {
            this._dddd = new DDDD({
                collapseGroups: true,
                onLayerChange: (e) => {
                    this.dispatchEvent('layer:change', e);
                },
            });
        }
    }
}

/* eslint-disable */
let debuggerInstance = null;
export default debuggerInstance;
