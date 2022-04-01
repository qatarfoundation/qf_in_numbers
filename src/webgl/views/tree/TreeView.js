// Vendor
import { component } from '@/utils/bidello';
import { Scene, Vector3 } from 'three';
import { ResourceManager } from 'resource-loader';

// Modules
import CameraManager from '@/webgl/modules/CameraManager';

// Components
import TreeComponent from '@/webgl/components/tree/TreeComponent';

export default class TreeView extends component() {
    init(options = {}) {
        // Props
        this._config = options.config;

        // Setup
        this._resourceManager = this._createResourceManager();
        this._scene = this._createScene();
        this._cameraManager = this._createCameraManager();
        this._components = this._createComponents();
    }

    destroy() {
        super.destroy();
    }

    /**
     * Getters & Setters
     */
    get scene() {
        return this._scene;
    }

    get camera() {
        return this._cameraManager.camera;
    }

    /**
     * Public
     */
    show() {
    }

    hide(callback) {
    }

    prepare() {
    }

    /**
     * Private
     */
    _createResourceManager() {
        const resourceManager = new ResourceManager({
            namespace: 'HomeView',
        });
        return resourceManager;
    }

    _createScene() {
        const scene = new Scene();
        return scene;
    }

    _createCameraManager() {
        const cameraManager = new CameraManager({
            debugContainer: this._config.name,
            position: new Vector3(0, 0, 19),
            scene: this._scene,
            orbit: true,
        });
        return cameraManager;
    }

    /**
     * Components
     */
    _createComponents() {
        const components = {};
        components.tree = this._createTreeComponent();
        return components;
    }

    _createTreeComponent() {
        const component = new TreeComponent();
        this._scene.add(component);
        return component;
    }

    _destroyComponents() {
        if (!this._components) return;
        for (const key in this._components) {
            if (typeof this._components[key].destroy === 'function') this._components[key].destroy();
        }
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._updateComponents({ time, delta });
    }

    _updateComponents({ time, delta }) {
        let component;
        for (const key in this._components) {
            component = this._components[key];
            if (typeof component.update === 'function') {
                component.update({ time, delta });
            }
        }
    }
}
