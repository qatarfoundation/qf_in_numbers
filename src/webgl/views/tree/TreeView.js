// Vendor
import { component } from '@/utils/bidello';
import { Scene, Vector3, Euler, Fog } from 'three';
import { ResourceManager } from 'resource-loader';

// Modules
import CameraManager from '@/webgl/modules/CameraManager';

// Utils
import Debugger from '@/utils/Debugger';
import math from '@/utils/math';
import number from '@/utils/number';
import easings from '@/utils/easings';

// Components
import TreeComponent from '@/webgl/components/tree/TreeComponent';
import FloorComponent from '@/webgl/components/tree/FloorComponent';
import LeavesComponent from '@/webgl/components/tree/LeavesComponent';
import LeavesBasicComponent from '@/webgl/components/tree/LeavesBasicComponent';

export default class TreeView extends component() {
    init(options = {}) {
        // Props
        this._config = options.config;

        // Props
        this._rotation = { current: 0, target: 0 };
        this._position = { current: 0, target: 0 };

        // Setup
        this._resourceManager = this._createResourceManager();
        this._scene = this._createScene();
        this._cameraManager = this._createCameraManager();
    }

    destroy() {
        super.destroy();
        this._destroyComponents();
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
            // orbit: true,
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
            cameraManager: this._cameraManager,
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
     * Mouse
     */
    onMousemove({ centered }) {
        const sign = centered.x > 0 ? 1 : -1;
        const value = number.clamp(easings.easeOutCubic(Math.abs(centered.x)), 0, 1);
        this._rotation.target = number.map(value * -sign, -1, 1, -0.6, 0.6);

        {
            const sign = centered.x > 0 ? 1 : -1;
            const value = number.clamp(easings.easeOutCubic(Math.abs(centered.x)), 0, 1);
            this._position.target = number.map(value, -1, 1, -0.7, 0.7);
        }
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._updateComponents({ time, delta });
        this._rotation.current = math.lerp(this._rotation.current, this._rotation.target, 0.03);
        this._scene.rotation.y = this._rotation.current;

        this._position.current = math.lerp(this._position.current, this._position.target, 0.02);
        // this._scene.position.z = Math.abs(this._position.current) * 10;

        // this._scene.rotation.x = Math.abs(this._position.current) * 0.2;
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
