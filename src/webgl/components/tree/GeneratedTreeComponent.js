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
        this._showAllBranches();
    }

    gotoCategory(name) {
        this._activateBranch(name);
    }

    getGategoryCameraPosition(name) {
        return this._activeBranch.getCameraAnchorSubcategory(name);
    }

    getEntityCameraPosition(categoryName, name) {
        return this._activeBranch.getCameraAnchorEntity(categoryName, name);
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

        data.forEach((branch) => {
            const component = new GeneratedBranchComponent({
                debug: this._debug,
                data: branch.data,
                position: branch.position,
                rotation: branch.rotation,
                scene: this._scene,
            });
            this.add(component);

            component.position.copy(branch.position);
            component.rotation.copy(branch.rotation);
            component.setup();

            branches[branch.name] = component;
        });
        return branches;
    }

    _showAllBranches() {
        for (const key in this._branches) {
            this._branches[key].show();
        }
    }

    _activateBranch(activeBranchName) {
        for (const key in this._branches) {
            if (key === activeBranchName) {
                this._activeBranch = this._branches[key];
            } else {
                this._branches[key].hide();
            }
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
