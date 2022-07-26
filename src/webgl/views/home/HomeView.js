// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Scene, Vector3, Euler, Fog, Object3D } from 'three';
import { ResourceManager } from 'resource-loader';

// Modules
import CameraManager from '@/webgl/modules/CameraManager';

// Utils
import Debugger from '@/utils/Debugger';
import math from '@/utils/math';
import number from '@/utils/number';
import easings from '@/utils/easings';
import TreeDataModel from '@/utils/TreeDataModel';

// Components
import TreeComponent from '@/webgl/components/tree/TreeComponent';
import FloorComponent from '@/webgl/components/tree/FloorComponent';
import LeavesComponent from '@/webgl/components/tree/LeavesComponent';
import LeavesBasicComponent from '@/webgl/components/tree/LeavesBasicComponent';
import GeneratedTreeComponent from '@/webgl/components/tree/GeneratedTreeComponent';
import EntityComponent from '@/webgl/components/tree/EntityComponent';

export default class HomeView extends component() {
    init(options = {}) {
        // Props
        this._config = options.config;

        // Props
        this._rotation = { current: 0, target: 0 };
        this._position = { current: 0, target: 0 };
        this._activeEntity = null;
        this._movingToEntity = false;
        this._activeBranch = null;
        this._hasTransitionedIn = false;

        // Setup
        this._debug = this._createDebug();
        this._resourceManager = this._createResourceManager();
        this._scene = this._createScene();
        this._cameraManager = this._createCameraManager();
        this._container = this._createContainer();
        this._components = this._createComponents();
    }

    destroy() {
        super.destroy();
        this._destroyComponents();
        this._timelineGotoCategory?.kill();
        this._timelineGotoSubcategory?.kill();
        this._timelineGotoEntity?.kill();
        this._timelineGotoOverview?.kill();
        this._timelineShowTree?.kill();
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

    get components() {
        return this._components;
    }

    /**
     * Public
     */
    show() {
        this._resourceManager.load().then(() => {
        });
    }

    hide(callback) {
    }

    prepare() {
    }

    transitionIn() {
        if (this._hasTransitionedIn) return;

        this._hasTransitionedIn = true;

        this._timelineTransitionIn = new gsap.timeline();

        this._timelineTransitionIn.add(this._components.tree.transitionIn(), 0);

        return this._timelineTransitionIn;
    }

    resetTreeRotation() {
        this._components.tree.resetRotation();
    }

    gotoOverview() {
        this._timelineShowTree?.kill();
        this._timelineGotoOverview?.kill();
        this._timelineGotoCategory?.kill();
        this._timelineGotoSubcategory?.kill();
        this._timelineGotoEntity?.kill();
        this._timelineSelectEntity?.kill();

        this._timelineGotoOverview = new gsap.timeline();

        if (this._activeBranch !== null) this._timelineGotoOverview.call(() => this.categoryMouseLeave(this._activeBranch), null, 0);
        if (this._activeEntity) this._timelineGotoOverview.add(this._activeEntity.hide(), 0);
        this._timelineGotoOverview.call(() => this._resetBackgroundColor(), null, 0);
        this._timelineGotoOverview.add(this._cameraManager.main.gotoOverview(), 0);
        this._timelineGotoOverview.add(this._components.generatedTree.gotoOverview(), 0);
        this._timelineGotoOverview.add(this._components.leavesBasic.show(), 0.8);
        this._timelineGotoOverview.add(this._components.tree.show(), 1);

        return this._timelineGotoOverview;
    }

    gotoCategory(slug) {
        this._timelineShowTree?.kill();
        this._timelineGotoOverview?.kill();
        this._timelineGotoCategory?.kill();
        this._timelineGotoSubcategory?.kill();
        this._timelineGotoEntity?.kill();
        this._timelineSelectEntity?.kill();

        this._timelineGotoCategory = new gsap.timeline();
        this._timelineGotoCategory.call(() => { this._setBackgroundColor(slug); }, null, 0);
        this._timelineGotoCategory.call(() => { this._cameraManager.main.gotoCategory(slug); }, null, 0);
        this._timelineGotoCategory.call(() => { this._components.generatedTree.gotoCategory(slug); }, null, 0);
        this._timelineGotoCategory.add(this._components.tree.hide(), 0);
        this._timelineGotoCategory.add(this._components.leavesBasic.hide(), 0);

        return this._timelineGotoCategory;
    }

    gotoSubcategory(categorySlug, name) {
        const position = this._components.generatedTree.getSubGategoryCameraPosition(categorySlug, name);

        this._timelineShowTree?.kill();
        this._timelineGotoOverview?.kill();
        this._timelineGotoCategory?.kill();
        this._timelineGotoSubcategory?.kill();
        this._timelineGotoEntity?.kill();
        this._timelineSelectEntity?.kill();

        this._timelineGotoSubcategory = new gsap.timeline();
        this._timelineGotoSubcategory.call(() => this._setBackgroundColor(categorySlug), null, 0);
        this._timelineGotoSubcategory.call(() => this._cameraManager.main.gotoPosition(position), null, 0);
        this._timelineGotoSubcategory.add(this._components.tree.hide(), 0.5);

        return this._timelineGotoSubcategory;
    }

    gotoEntity(categorySlug, name) {
        this._movingToEntity = true;
        this._activeEntity?.hide();
        this._activeEntity = this._components.generatedTree.getEntity(categorySlug, name);

        this._timelineShowTree?.kill();
        this._timelineGotoOverview?.kill();
        this._timelineGotoCategory?.kill();
        this._timelineGotoSubcategory?.kill();
        this._timelineGotoEntity?.kill();
        this._timelineSelectEntity?.kill();

        this._timelineGotoEntity = new gsap.timeline({ onComplete: () => {this._movingToEntity = false;} });

        this._timelineGotoEntity.call(() => this._setBackgroundColor(categorySlug), null, 0);
        this._timelineGotoEntity.call(() => this._components.leavesBasic.hide(), null, 0);
        this._timelineGotoEntity.add(this._components.tree.hide(), 0);
        this._timelineGotoEntity.call(() => this._cameraManager.main.gotoPosition(this._activeEntity.cameraAnchor), null, 0.5);
        this._timelineGotoEntity.call(() => this._components.generatedTree.gotoCategory(categorySlug), null, 2.5);
        this._timelineGotoEntity.add(this._activeEntity.show(), 2.5);

        return this._timelineGotoEntity;
    }

    selectEntity(entity, category) {
        this._timelineShowTree?.kill();
        this._timelineGotoOverview?.kill();
        this._timelineGotoCategory?.kill();
        this._timelineGotoSubcategory?.kill();
        this._timelineGotoEntity?.kill();
        this._timelineSelectEntity?.kill();

        this._timelineSelectEntity = new gsap.timeline();

        if (this._activeEntity) this._timelineSelectEntity.add(this._activeEntity.hide(), 0);
        this._timelineSelectEntity.add(this._components.generatedTree.hideActiveBranch(), 0);
        this._timelineSelectEntity.add(this._components.tree.quickHide(), 0);
        this._timelineSelectEntity.add(this._components.leavesBasic.hide(), 0);
        this._timelineSelectEntity.call(() => { this._setBackgroundColor(category); }, null, 0);
        this._timelineSelectEntity.add(this._components.entity.show(entity, category), 0.3);

        return this._timelineSelectEntity;
    }

    hideCurrentEntity() {
        this._components.entity.hide();
        this._activeEntity?.hide();
    }

    categoryMouseEnter(name) {
        this._activeBranch = name;
        this._components.tree.categoryMouseEnter(name);
    }

    categoryMouseLeave(name) {
        this._activeBranch = null;
        this._components.tree.categoryMouseLeave(name);
    }

    /**
     * Private
     */
    _createResourceManager() {
        const resourceManager = new ResourceManager({
            namespace: 'Home',
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
            type: 'tree',
            position: new Vector3(0, 5.81, 15.88),
            target: new Vector3(0, 8, 0), // new Euler(0.16, 0, 0)
            scene: this._scene,
            // orbit: true,
        });

        return cameraManager;
    }

    _createContainer() {
        const container = new Object3D();
        this._scene.add(container);
        return container;
    }

    _setBackgroundColor(name) {
        const config = TreeDataModel.getBranch(name);

        gsap.killTweensOf(this.$composer.passes.backgroundGradient.color);
        gsap.killTweensOf(this.$composer.passes.backgroundGradient);

        gsap.to(this.$composer.passes.backgroundGradient.color, { duration: 1.5, r: config.backgroundColor.r, g: config.backgroundColor.g, b: config.backgroundColor.b, ease: 'sine.inOut' });
        gsap.to(this.$composer.passes.backgroundGradient, { duration: 1, gradientType: 1, ease: 'sine.out' });
    }

    _resetBackgroundColor() {
        gsap.killTweensOf(this.$composer.passes.backgroundGradient.color);
        gsap.killTweensOf(this.$composer.passes.backgroundGradient);

        gsap.to(this.$composer.passes.backgroundGradient.color, { duration: 1.5, r: 0.08235294117647059, g: 0.29411764705882354, b: 0.2823529411764706, ease: 'sine.inOut' });
        gsap.to(this.$composer.passes.backgroundGradient, { duration: 1, gradientType: 0, ease: 'sine.out' });
    }

    /**
     * Components
     */
    _createComponents() {
        const components = {};
        components.tree = this._createTreeComponent();
        // components.floor = this._createFloorComponent();
        components.leavesBasic = this._createLeavesBasicComponent();
        // components.leaves = this._createLeavesComponent();
        // components.leaves2 = this._createLeaves2Component();
        components.generatedTree = this._createGeneratedTreeComponent();
        components.entity = this._createEntityComponent();
        return components;
    }

    _createTreeComponent() {
        const component = new TreeComponent({
            debugContainer: this._config.name,
            config: this._config,
            cameraManager: this._cameraManager,
        });
        this._container.add(component);
        return component;
    }

    _createFloorComponent() {
        const component = new FloorComponent({
            debugContainer: this._config.name,
        });
        this._container.add(component);
        return component;
    }

    _createLeavesBasicComponent() {
        const component = new LeavesBasicComponent({
            debugContainer: this._config.name,
            config: this._config,
        });
        this._container.add(component);
        return component;
    }

    _createLeavesComponent() {
        const component = new LeavesComponent({
            delay: 3.7 + 3,
        });
        component.position.set(3.87, 14.86, 7.96);
        component.rotation.set(0.35, 0.02, -0.08);
        this._container.add(component);
        return component;
    }

    _createLeaves2Component() {
        const component = new LeavesComponent({
            delay: 4.5 + 3,
        });
        component.position.set(-4.10, 11.31, -9.70);
        component.rotation.set(-1.17, 0, 0);
        this._container.add(component);
        return component;
    }

    _createGeneratedTreeComponent() {
        const component = new GeneratedTreeComponent({
            debugContainer: this._config.name,
            scene: this._scene,
            cameraManager: this._cameraManager,
        });
        this._container.add(component);
        return component;
    }

    _createEntityComponent() {
        const component = new EntityComponent({
            config: this._config,
        });
        this._container.add(component);
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
        // this._rotation.current = math.lerp(this._rotation.current, this._rotation.target, 0.03);
        // this._container.rotation.y = this._rotation.current;

        // this._position.current = math.lerp(this._position.current, this._position.target, 0.02);
        // this._container.position.z = Math.abs(this._position.current) * 10;
        // this._container.rotation.x = Math.abs(this._position.current) * 0.2;
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

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('View', { container: this._config.name });
        // debug.addButton('Goto community', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoCategory('Community');
        //     },
        // });
        // debug.addButton('Goto research', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoCategory('Research');
        //     },
        // });
        // debug.addButton('Goto education', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoCategory('Education');
        //     },
        // });
        // debug.addButton('Goto subcategory - Arts and Culture', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoSubcategory('Arts and Culture');
        //     },
        // });
        // debug.addButton('Goto subcategory - Health and Sustainability', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoSubcategory('Health and Sustainability');
        //     },
        // });
        // debug.addButton('Goto subcategory - Heritage', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoSubcategory('Heritage');
        //     },
        // });
        // debug.addButton('Goto subcategory - Social Development', {
        //     fullWidth: true,
        //     onClick: () => {
        //         this.gotoSubcategory('Social Development');
        //     },
        // });

        return debug;
    }
}
