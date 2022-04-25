// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, Vector2, Raycaster, Color } from 'three';
import { navigate } from 'gatsby';

// Utils
import Debugger from '@/utils/Debugger';
import Cursor from '@/webgl/utils/Cursor';

// Components
import TreeBranchComponent from '@/webgl/components/tree/TreeBranchComponent';

export default class TreeComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._config = options.config;
        this._debugContainer = options.debugContainer;
        this._cameraManager = options.cameraManager;

        // Setup
        this._isActive = true;
        this._defaultBackgroundColor = new Color(this._config.renderer.clearColor);
        this._backgroundColor = this._getBackgroundColor();
        this._activeBranch = undefined;
        this._mousePosition = new Vector2();
        this._debug = this._createDebug();
        this._raycaster = this._createRaycaster();
        this._branches = this._createBranches();
        this._hitAreas = this._createHitAreas();

        this._bindHandlers();
        this._setupEventListeners();

        // Settings
        this.rotation.y = Math.PI * 0.5;
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
        this._timelineShow?.kill();
        this._timelineHide?.kill();
    }

    /**
     * Public
     */
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
        this._timelineHide = new gsap.timeline({
            onComplete: () => {

            },
        });
        for (let i = 0, len = this._branches.length; i < len; i++) {
            this._timelineHide.add(this._branches[i].hide(), 0);
        }
        return this._timelineHide;
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._clickHandler = this._clickHandler.bind(this);
    }

    _setupEventListeners() {
        window.addEventListener('click', this._clickHandler);
    }

    _removeEventListeners() {
        window.removeEventListener('click', this._clickHandler);
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
                hoverColor: branch.hoverColor,
                hoverBackgroundColor: branch.hoverBackgroundColor,
                cameraManager: this._cameraManager,
                anchorPosition: branch.anchorPosition,
                slug: branch.slug,
            });
            component.position.copy(branch.position);
            component.rotation.copy(branch.rotation);
            component.mesh.rotation.copy(branch.meshRotation);
            this.add(component);
            branches.push(component);
        });
        return branches;
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
        this._updateMouseInteractions();
    }

    _updateBranches({ time, delta }) {
        for (let i = 0, len = this._branches.length; i < len; i++) {
            this._branches[i].update({ time, delta });
        }
    }

    _updateMouseInteractions() {
        this._raycaster.setFromCamera(this._mousePosition, this._cameraManager.camera);
        const intersects = this._raycaster.intersectObjects(this._hitAreas);
        if (intersects.length > 0) {
            Cursor.pointer();
            const branch = intersects[0].object.parent;
            if (this._activeBranch !== branch) {
                this._activeBranch?.mouseLeave();
                this._tweenBackgroundColor(branch.hoverBackgroundColor);
            }

            this._activeBranch = branch;
            this._activeBranch.mouseEnter();
        } else {
            Cursor.auto();
            if (this._activeBranch) {
                this._activeBranch.mouseLeave();
                this._activeBranch = null;
                this._tweenBackgroundColor(this._defaultBackgroundColor);
            }
        }
    }

    _tweenBackgroundColor(color) {
        this._backgroundHoverTween?.kill();
        this._backgroundHoverTween = gsap.to(this, 1, {
            _backgroundColor: `#${ color.getHexString() }`,
            onUpdate: () => {
                this.$renderer.setClearColor(this._backgroundColor);
            },
        });
    }

    /**
     * Mouse
     */
    onMousemove({ centered }) {
        this._mousePosition.copy(centered);
    }

    /**
     * Handlers
     */
    _clickHandler() {
        if (this._activeBranch) navigate('/2021/' + this._activeBranch.slug);
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
