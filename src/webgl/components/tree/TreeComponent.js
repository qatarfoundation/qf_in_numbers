// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, Vector2, Raycaster, Color } from 'three';

// Utils
import Debugger from '@/utils/Debugger';
import Cursor from '@/webgl/utils/Cursor';
import Globals from '@/utils/Globals';

// Components
import TreeBranchComponent from '@/webgl/components/tree/TreeBranchComponent';

// Store
import useStore from '@/hooks/useStore';
import number from '@/utils/number/index';

export default class TreeComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._config = options.config;
        this._debugContainer = options.debugContainer;
        this._cameraManager = options.cameraManager;

        // Settings
        this._settings = {
            initialPosition: {
                x: 0,
                y: 0,
                z: 17.31,
            },
            targetPosition: {
                x: 0,
                y: 0,
                z: 0,
            },
            initialRotation: {
                x: 0,
                y: 4.63,
                z: -0.52,
            },
            targetRotation: {
                x: 0,
                y: Math.PI * 0.5,
                z: 0,
            },
        };

        // Setup
        this._isActive = false;
        this._idleRotationSpeed = { value: 0.05 };
        this._idleRotationAmplitude = { value: 45 };
        this._activeBranch = undefined;
        this._mousePosition = new Vector2(0, 0);
        this._mouseRotation = new Vector2(0, 0);
        this._enableMouseRotation = false;
        this._debug = this._createDebug();
        // this._raycaster = this._createRaycaster();
        this._branchesContainer = new Object3D();
        this.add(this._branchesContainer);
        this._branches = this._createBranches();
        // this._hitAreas = this._createHitAreas();

        this._bindHandlers();
        this._setupEventListeners();

        this.visible = true;

        this.position.x = this._settings.initialPosition.x;
        this.position.y = this._settings.initialPosition.y;
        this.position.z = this._settings.initialPosition.z;

        this.rotation.x = this._settings.initialRotation.x;
        this.rotation.y = this._settings.initialRotation.y;
        this.rotation.z = this._settings.initialRotation.z;

        this.mouseRotationXTo = gsap.quickTo(this._mouseRotation, 'x', { duration: 3, ease: 'sine.out' });
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
        this._timelineTransitionIn?.kill();
        this._timelineShow?.kill();
        this._timelineHide?.kill();
    }

    /**
     * Public
     */
    transitionIn() {
        this._isActive = true;
        this._enableMouseRotation = false;

        this._timelineTransitionIn = new gsap.timeline();

        // Position
        this._timelineTransitionIn.fromTo(this.position, { x: this._settings.initialPosition.x }, { duration: 3, x: this._settings.targetPosition.x, ease: 'power3.inOut' }, 0);
        this._timelineTransitionIn.fromTo(this.position, { y: this._settings.initialPosition.y }, { duration: 3, y: this._settings.targetPosition.y, ease: 'power3.inOut' }, 0);
        this._timelineTransitionIn.fromTo(this.position, { z: this._settings.initialPosition.z }, { duration: 3, z: this._settings.targetPosition.z, ease: 'power3.inOut' }, 0);

        // Rotation
        this._timelineTransitionIn.fromTo(this.rotation, { x: this._settings.initialRotation.x }, { duration: 3, x: this._settings.targetRotation.x, ease: 'power3.inOut' }, 0);
        this._timelineTransitionIn.fromTo(this.rotation, { y: this._settings.initialRotation.y }, { duration: 3, y: this._settings.targetRotation.y, ease: 'power3.inOut' }, 0);
        this._timelineTransitionIn.fromTo(this.rotation, { z: this._settings.initialRotation.z }, { duration: 3, z: this._settings.targetRotation.z, ease: 'power3.inOut' }, 0);

        // Mouse Rotation
        this._timelineTransitionIn.add(() => { this._enableMouseRotation = true; }, 3);

        // Idle rotation
        // if (this.$root.idleRotation) this._timelineTransitionIn.to(this._idleRotationSpeed, { value: .15, duration: 2, ease: 'none' }, 4);

        return this._timelineTransitionIn;
    }

    resetRotation() {
        gsap.to(this._branchesContainer.rotation, {
            y: 0,
            duration: 1.5,
            ease: 'sine.inOut',
            onComplete: () => {
                this._idleRotationSpeed.value = 0;
            },
        });
    }

    show() {
        this._isActive = true;

        this._timelineShow = new gsap.timeline();
        for (let i = 0, len = this._branches.length; i < len; i++) {
            this._timelineShow.add(this._branches[i].show(), 0);
        }
        return this._timelineShow;
    }

    hide() {
        this._isActive = false;
        Cursor.auto();

        this._timelineHide = new gsap.timeline();
        for (let i = 0, len = this._branches.length; i < len; i++) {
            this._timelineHide.add(this._branches[i].hide(), 0);
        }
        return this._timelineHide;
    }

    categoryMouseEnter(name) {
        const branch = this._getBranch(name);
        branch.mouseEnter();
    }

    categoryMouseLeave(name) {
        const branch = this._getBranch(name);
        branch.mouseLeave();
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._clickHandler = this._clickHandler.bind(this);
    }

    _setupEventListeners() {
        this.$root.mouseAreaElement.addEventListener('click', this._clickHandler);
    }

    _removeEventListeners() {
        this.$root.mouseAreaElement.removeEventListener('click', this._clickHandler);
    }

    _createRaycaster() {
        const raycaster = new Raycaster();
        return raycaster;
    }

    _getBackgroundColor() {
        const hex = new Color(this._config.renderer.clearColor).getHexString();
        const color = `#${ hex }`;
        return color;
    }

    _createBranches() {
        const branches = [];
        this._config.branches.forEach((branch, index) => {
            const component = new TreeBranchComponent({
                index,
                config: this._config,
                debug: this._debug,
                particleColors: branch.particleColors,
                backgroundColor: branch.backgroundColor,
                cameraManager: this._cameraManager,
                anchorPosition: branch.anchorPosition,
                subcategoriesAnchorPosition: branch.subcategoriesAnchorPosition,
                slug: branch.slug,
            });
            component.position.copy(branch.position);
            component.rotation.copy(branch.rotation);
            component.mesh.rotation.copy(branch.meshRotation);
            this._branchesContainer.add(component);
            branches.push(component);
        });
        return branches;
    }

    _getBranch(slug) {
        let item;
        for (let i = 0, len = this._branches.length; i < len; i++) {
            item = this._branches[i];
            if (item.slug === slug) return item;
        }
    }

    _createHitAreas() {
        const hitAreas = [];
        this._branches.forEach((branch) => {
            hitAreas.push(branch.hitArea);
        });
        return hitAreas;
    }

    /**
     * Update
     */
    update({ time, delta }) {
        if (!this._isActive) return;
        this._updateBranches({ time, delta });
        if (this.$root.idleRotation) this._updateRotation({ time, delta });
        this._updateMouseRotation();
        // if (this.$root.isInteractive) this._updateMouseInteractions();
    }

    _updateMouseRotation() {
        if (this._enableMouseRotation && this._idleRotationSpeed.value === 0) this.rotation.y = this._settings.targetRotation.y - this._mouseRotation.x;
    }

    _updateRotation({ time, delta }) {
        this._branchesContainer.rotation.y = -Math.sin(this._idleRotationSpeed.value * time) * number.degreesToRadians(this._idleRotationAmplitude.value);
    }

    _updateBranches({ time, delta }) {
        for (let i = 0, len = this._branches.length; i < len; i++) {
            this._branches[i].update({ time, delta });
        }
    }

    // _updateMouseInteractions() {
    //     this._raycaster.setFromCamera(this._mousePosition, this._cameraManager.camera);
    //     const intersects = this._raycaster.intersectObjects(this._hitAreas);
    //     if (intersects.length > 0) {
    //         Cursor.pointer();
    //         const branch = intersects[0].object.parent;
    //         if (this._activeBranch !== branch) {
    //             this._activeBranch?.mouseLeave();

    //             this._activeBranch = branch;
    //             this._activeBranch.mouseEnter();

    //             this._fadeOutBranches(branch);
    //         }
    //     } else {
    //         Cursor.auto();
    //         if (this._activeBranch) {
    //             this._activeBranch.mouseLeave();
    //             this._activeBranch = null;
    //             this._fadeInBranches();
    //         }
    //     }
    // }

    _fadeInBranches() {
        this._branches.forEach((branch) => {
            branch.fadeIn();
        });
    }

    _fadeOutBranches(activeBranch) {
        this._branches.forEach((branch) => {
            if (activeBranch !== branch) {
                branch.fadeOut();
            }
        });
    }

    /**
     * Mouse
     */
    onMousemove({ centered }) {
        if (this.$root.isInteractive) {
            this._mousePosition.copy(centered);
            if (this.$root.mouseRotation && this._enableMouseRotation)
                this.mouseRotationXTo(this._mousePosition.x * .05);
            else this.mouseRotationXTo(0);
        }
    }

    /**
     * Handlers
     */
    _clickHandler() {
        if (this._isActive && this._activeBranch) Globals.navigate(`/${ useStore.getState().currentYear }/${ this._activeBranch.slug }`);
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const props = {
            showHitArea: false,
        };

        const debug = Debugger.addGroup('Tree', { container: this._debugContainer });

        const positionDebug = debug.addGroup('Position');

        positionDebug.add(this._settings.initialPosition, 'x', { label: 'Initial Position X', onChange: () => { positionChangedHandler('initialPosition'); } });
        positionDebug.add(this._settings.initialPosition, 'y', { label: 'Initial Position Y', onChange: () => { positionChangedHandler('initialPosition'); } });
        positionDebug.add(this._settings.initialPosition, 'z', { label: 'Initial Position Z', onChange: () => { positionChangedHandler('initialPosition'); } });

        positionDebug.add(this._settings.targetPosition, 'x', { label: 'Target Position X', onChange: () => { positionChangedHandler('targetPosition'); } });
        positionDebug.add(this._settings.targetPosition, 'y', { label: 'Target Position Y', onChange: () => { positionChangedHandler('targetPosition'); } });
        positionDebug.add(this._settings.targetPosition, 'z', { label: 'Target Position Z', onChange: () => { positionChangedHandler('targetPosition'); } });

        const positionChangedHandler = (key) => {
            this.position.x = this._settings[key].x;
            this.position.y = this._settings[key].y;
            this.position.z = this._settings[key].z;
        };

        const rotationDebug = debug.addGroup('Rotation');

        rotationDebug.add(this._settings.initialRotation, 'x', { label: 'Initial Rotation X', onChange: () => { rotationChangedHandler('initialRotation'); } });
        rotationDebug.add(this._settings.initialRotation, 'y', { label: 'Initial Rotation Y', onChange: () => { rotationChangedHandler('initialRotation'); } });
        rotationDebug.add(this._settings.initialRotation, 'z', { label: 'Initial Rotation Z', onChange: () => { rotationChangedHandler('initialRotation'); } });

        rotationDebug.add(this._settings.targetRotation, 'x', { label: 'Target Rotation X', onChange: () => { rotationChangedHandler('targetRotation'); } });
        rotationDebug.add(this._settings.targetRotation, 'y', { label: 'Target Rotation Y', onChange: () => { rotationChangedHandler('targetRotation'); } });
        rotationDebug.add(this._settings.targetRotation, 'z', { label: 'Target Rotation Z', onChange: () => { rotationChangedHandler('targetRotation'); } });

        const rotationChangedHandler = (key) => {
            this.rotation.x = this._settings[key].x;
            this.rotation.y = this._settings[key].y;
            this.rotation.z = this._settings[key].z;
        };

        debug.addButton('Transition In', {
            onClick: () => {
                this.transitionIn();
            },
        });

        debug.add(props, 'showHitArea', {
            onChange: () => {
                this._branches.forEach((branch) => {
                    branch.hitArea.visible = props.showHitArea;
                });
            },
        });

        return debug;
    }
}
