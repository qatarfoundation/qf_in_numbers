// Vendor
import { Object3D } from 'three';
import { component } from '@/utils/bidello';

// Components
import BranchCategoryComponent from '@/webgl/components/tree/BranchCategoryComponent';

export default class GeneratedBranchComponent extends component(Object3D) {
    init(options) {
        // Options
        this._model = options.model;
        this._data = options.data;
        this._scene = options.scene;
        this._colors = options.colors;
        this._cameraManager = options.cameraManager;

        // Setup
        this._debug = this._createDebug(options.debug);
    }

    setup() {
        this._branchCategory = this._createBranchCategoryComponent();
    }

    /**
     * Public
     */
    show() {
        this._branchCategory.show();
    }

    hide() {
        this._branchCategory.hide();
    }

    getCategory() {
        return this._branchCategory;
    }

    /**
     * Private
     */
    _createBranchCategoryComponent() {
        const component = new BranchCategoryComponent({
            data: this._data,
            scene: this._scene,
            colors: this._colors,
            cameraManager: this._cameraManager,
        });
        this.add(component);
        return component;
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._branchCategory.update({ time, delta });
    }

    /**
     * Debug
     */
    _createDebug(debug) {
        if (!debug) return;
        const group = debug.addGroup('Branch #' + this._index);
        return group;
    }
}
