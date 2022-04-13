// Vendor
import { component } from '@/utils/bidello';
import { Euler, Object3D, Vector2, Vector3, Raycaster, Color } from 'three';

// Utils
import Debugger from '@/utils/Debugger';
import Cursor from '@/webgl/utils/Cursor';

// Components
import TreeBranchComponent from '@/webgl/components/tree/TreeBranchComponent';

// Config
const BRANCHES = [
    {
        position: new Vector3(),
        rotation: new Euler(0, -1.04, 0.52),
        meshRotation: new Euler(0, 0.19, 0),
        hoverColor: new Color(0xFF671F),
    },
    {
        position: new Vector3(),
        rotation: new Euler(0, 3.17, 0.31),
        meshRotation: new Euler(0, -2.00, 0),
        hoverColor: new Color(0x00BCE7),
    },
    {
        position: new Vector3(),
        rotation: new Euler(0, 0.78, 0.55),
        meshRotation: new Euler(0, 0.20, 0),
        hoverColor: new Color(0x034638),
    },
];

export default class TreeComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;
        this._cameraManager = options.cameraManager;

        // Setup

        this._mousePosition = new Vector2();
        this._debug = this._createDebug();
        this._raycaster = this._createRaycaster();
        this._branches = this._createBranches();
        this._hitAreas = this._createHitAreas();

        // Settings
        this.rotation.y = Math.PI * 0.5;
    }

    /**
     * Private
     */
    _createRaycaster() {
        const raycaster = new Raycaster();
        return raycaster;
    }

    _createBranches() {
        const branches = [];
        BRANCHES.forEach((branch, index) => {
            const component = new TreeBranchComponent({
                debug: this._debug,
                hoverColor: branch.hoverColor,
                index,
                cameraManager: this._cameraManager,
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
            }
            this._activeBranch = branch;
            this._activeBranch.mouseEnter();
        } else {
            Cursor.auto();
            if (this._activeBranch) {
                this._activeBranch.mouseLeave();
                this._activeBranch = null;
            }
        }
    }

    /**
     * Mouse
     */
    onMousemove({ centered }) {
        this._mousePosition.copy(centered);
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
