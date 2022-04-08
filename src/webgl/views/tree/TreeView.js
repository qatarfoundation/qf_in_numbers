// Vendor
import { component } from '@/utils/bidello';
import { Scene, Vector3, Euler, Fog } from 'three';
import { ResourceManager } from 'resource-loader';

// Modules
import CameraManager from '@/webgl/modules/CameraManager';

// Utils
import Debugger from '@/utils/Debugger';

// Components
import TreeComponent from '@/webgl/components/tree/TreeComponent';
import FloorComponent from '@/webgl/components/tree/FloorComponent';
import LeavesComponent from '@/webgl/components/tree/LeavesComponent';
import LeavesBasicComponent from '@/webgl/components/tree/LeavesBasicComponent';

export default class TreeView extends component() {
    init(options = {}) {
        // Props
        this._config = options.config;

        // Setup
        this._resourceManager = this._createResourceManager();
        this._scene = this._createScene();
        this._cameraManager = this._createCameraManager();
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
        this._resourceManager.load().then(() => {
            this._components = this._createComponents();
        });
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
            namespace: 'Tree',
        });
        return resourceManager;
    }

    _createScene() {
        const scene = new Scene();

        const fog = new Fog(0x000000, 14, 202);
        scene.fog = fog;

        if (Debugger) {
            const settings = {
                enabled: !!scene.fog,
            };

            const debug = Debugger.addGroup('Fog', { container: this._config.name });
            debug.add(settings, 'enabled', {
                onChange: () => {
                    if (settings.enabled) {
                        scene.fog = fog;
                    } else {
                        scene.fog = null;
                    }
                },
            });

            debug.add(fog, 'color');
            debug.add(fog, 'near', { stepSize: 1 });
            debug.add(fog, 'far', { stepSize: 1 });
        }

        return scene;
    }

    _createCameraManager() {
        const cameraManager = new CameraManager({
            debugContainer: this._config.name,
            position: new Vector3(0, 4.98, 21.85),
            rotation: new Euler(0.21, 0, 0),
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
        components.floor = this._createFloorComponent();
        // components.leavesBasic = this._createLeavesBasicComponent();
        // components.leaves = this._createLeavesComponent();
        // components.leaves2 = this._createLeaves2Component();
        return components;
    }

    _createTreeComponent() {
        const component = new TreeComponent({
            debugContainer: this._config.name,
        });
        this._scene.add(component);
        return component;
    }

    _createFloorComponent() {
        const component = new FloorComponent({
            debugContainer: this._config.name,
        });
        this._scene.add(component);
        return component;
    }

    _createLeavesBasicComponent() {
        const component = new LeavesBasicComponent({
            debugContainer: this._config.name,
        });
        this._scene.add(component);
        return component;
    }

    _createLeavesComponent() {
        const component = new LeavesComponent({
            delay: 3.7 + 3,
        });
        component.position.set(3.87, 14.86, 7.96);
        component.rotation.set(0.35, 0.02, -0.08);
        this._scene.add(component);
        return component;
    }

    _createLeaves2Component() {
        const component = new LeavesComponent({
            delay: 4.5 + 3,
        });
        component.position.set(-4.10, 11.31, -9.70);
        component.rotation.set(-1.17, 0, 0);
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
