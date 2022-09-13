// Vendor
import { component } from '@/utils/bidello';
import { Object3D, Vector3 } from 'three';
import { gsap } from 'gsap';

// Utils
import Debugger from '@/utils/Debugger';

// Components
import LeavesBasicPartComponent from '@/webgl/components/tree/LeavesBasicPartComponent';

const SPAWN_POSITIONS = [
    new Vector3(-9.31, 17.04, 0),
    new Vector3(-0.12, 18.20, 0.48),
    new Vector3(9.02, 17.76, -0.44),
];

export default class LeavesBasicComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._config = options.config;
        this._debugContainer = options.debugContainer;

        // Setup
        this._debug = this._createDebug();
        this._leaves = this._createLeaves();
    }

    destroy() {
        super.destroy();
    }

    /**
     * Public
     */
    show() {
        this._timelineShow?.kill();
        this._timelineHide?.kill();

        this._timelineShow = new gsap.timeline();

        this._leaves.forEach((part) => {
            this._timelineShow.add(part.show(), 0);
        });

        return this._timelineShow;
    }

    hide() {
        this._timelineShow?.kill();
        this._timelineHide?.kill();

        this._timelineHide = new gsap.timeline();

        this._leaves.forEach((part) => {
            this._timelineHide.add(part.hide(), 0);
        });

        return this._timelineHide;
    }

    /**
     * Private
     */
    _createLeaves() {
        const leaves = [];
        const branches = this._config.branches;
        SPAWN_POSITIONS.forEach((position, index) => {
            const part = new LeavesBasicPartComponent({
                index,
                debug: this._debug,
                particleColors: branches[index].particleColors,
            });
            part.position.copy(position);
            this.add(part);
            leaves.push(part);
        });
        return leaves;
    }

    /**
     * Update
     */
    update({ time, delta }) {
        for (let i = 0, len = this._leaves.length; i < len; i++) {
            this._leaves[i].update({ time, delta });
        }
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Leaves', { container: this._debugContainer });
        return debug;
    }
}
