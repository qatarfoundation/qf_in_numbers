// Vendor
import { component } from '@/utils/bidello';
import { Euler, Object3D, Vector3 } from 'three';

// Utils
import Debugger from '@/utils/Debugger';

// Components
import TreeBranchComponent from '@/webgl/components/tree/TreeBranchComponent';

// Config
const BRANCHES = [
    {
        position: new Vector3(),
        rotation: new Euler(-0.68, 2, 0),
    },
    {
        position: new Vector3(),
        rotation: new Euler(0, -4.64, 0),
    },
    {
        position: new Vector3(),
        rotation: new Euler(0.76, -26.4, 0.13),
    },
];

export default class TreeComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;

        // Setup
        this._debug = this._createDebug();
        this._branches = this._createBranches();

        // Settings
        this.rotation.y = Math.PI * 0.5;
    }

    /**
     * Private
     */
    _createBranches() {
        const branches = [];
        BRANCHES.forEach((branch) => {
            const component = new TreeBranchComponent({
                debug: this._debug,
            });
            component.position.copy(branch.position);
            component.rotation.copy(branch.rotation);
            this.add(component);
        });
        return branches;
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Tree', { container: this._debugContainer });
        return debug;
    }
}
