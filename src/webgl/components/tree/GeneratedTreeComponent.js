// Vendor
import { component } from '@/utils/bidello';
import { Object3D } from 'three';

// Utils
import Debugger from '@/utils/Debugger';
import TreeDataModel from '@/utils/TreeDataModel';

// Components
import GeneratedBranchComponent from '@/webgl/components/tree/GeneratedBranchComponent';

export default class GeneratedTreeComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;
        this._scene = options.scene;
        this._cameraManager = options.cameraManager;

        // Props
        this._activeBranch = null;

        // Transforms
        this.rotation.y = Math.PI * 0.5;

        // Setup
        this._debug = this._createDebug();
        this._branches = this._createBranches();
        this._bindHandlers();
        this._setupEventListeners();
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
    }

    /**
     * Public
     */
    gotoOverview() {
        this._hideAllBranches();
    }

    gotoCategory(slug) {
        this._activateBranch(slug);
    }

    getSubGategoryCameraPosition(categorySlug, name) {
        const branch = this._getBranch(categorySlug);
        return branch.getCameraAnchorSubcategory(name);
    }

    getEntity(categorySlug, name) {
        const branch = this._getBranch(categorySlug);
        return branch.getEntity(name);
    }

    hideActiveBranch() {
        this._activeBranch?.transitionOut();
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._modelBranchesAddHandler = this._modelBranchesAddHandler.bind(this);
    }

    _setupEventListeners() {
        TreeDataModel.addEventListener('branches/add', this._modelBranchesAddHandler);
    }

    _removeEventListeners() {
        TreeDataModel.removeEventListener('branches/add', this._modelBranchesAddHandler);
    }

    _createBranches() {
        const branches = {};

        const data = TreeDataModel.getBranches();
        if (data.length === 0) return;

        data.forEach((branch, index) => {
            const component = new GeneratedBranchComponent({
                index,
                debug: this._debug,
                data: branch.data,
                scene: this._scene,
                colors: branch.particleColors,
                cameraManager: this._cameraManager,
            });
            this.add(component);

            component.position.copy(branch.position);
            component.rotation.copy(branch.rotation);
            component.setup();

            branches[branch.slug] = component;
        });
        return branches;
    }

    _hideAllBranches() {
        for (const key in this._branches) {
            this._branches[key].hide();
        }
    }

    _getBranch(slug) {
        return this._branches[slug];
    }

    _activateBranch(activeBranchSlug) {
        for (const key in this._branches) {
            if (key === activeBranchSlug) {
                this._activeBranch = this._branches[key];
                this._activeBranch.show();
            } else {
                this._branches[key].hide();
            }
        }
    }

    /**
     * Update
     */
    update({ time, delta }) {
        for (const key in this._branches) {
            this._branches[key].update({ time, delta });
        }
    }

    /**
     * Handlers
     */
    _modelBranchesAddHandler() {
        this._branches = this._createBranches();
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Generated tree', { container: this._debugContainer });
        return debug;
    }
}
