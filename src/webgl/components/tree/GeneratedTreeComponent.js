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

        // Setup
        this._debug = this._createDebug();
        this._branches = this._createBranches();
        this._bindHandlers();
        this._setupEventListeners();

        // Transforms
        this.rotation.y = Math.PI * 0.5;
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
    }

    /**
     * Public
     */
    gotoCategory(name) {
        console.log('k!!!!8');
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
        const branches = [];

        const data = TreeDataModel.getBranches();
        data.forEach((branch) => {
            const component = new GeneratedBranchComponent({
                debug: this._debug,
                data: branch.data,
            });
            component.position.copy(branch.position);
            component.rotation.copy(branch.rotation);
            this.add(component);
            branches.push(component);
        });
        return branches;
    }

    /**
     * Handlers
     */
    _modelBranchesAddHandler() {
        this._createBranches();
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
