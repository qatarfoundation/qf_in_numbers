// Vendor
import { component } from '@/utils/bidello';
import { gsap } from 'gsap';
import { Object3D } from 'three';

// Utils
import Debugger from '@/utils/Debugger';
import Breakpoints from '@/utils/Breakpoints';

// Components
import RadialGradientComponent from '@/webgl/components/RadialGradientComponent';

export default class BackgroundGradientsComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._data = options.data;
        this._debugContainer = options.debugContainer;
        this._hidden = options.hidden;

        // Props
        this._breakpoint = null;
        this._gradients = [];

        // Setup
        this._createGradients();
        this._createDebug();
    }

    destroy() {
        super.destroy();
        this._timelineTransitionIn?.kill();
    }

    /**
     * Getters & Setters
     */
    get gradients() {
        return this._gradients;
    }

    /**
     * Public
     */
    transitionIn() {
        this._timelineTransitionIn = new gsap.timeline();
        for (let i = 0, len = this._gradients.length; i < len; i++) {
            this._timelineTransitionIn.add(this._gradients[i].show(), 0);
        }
        return this._timelineTransitionIn;
    }

    /**
     * Private
     */
    _createGradients() {
        // let breakpoint = Breakpoints.current;
        // breakpoint = breakpoint === 'medium' ? 'small' : breakpoint;
        const breakpoint = 'large';
        if (breakpoint === this._breakpoint) return;

        this._removeGradients();
        this._breakpoint = breakpoint;

        const data = this._data[this._breakpoint];

        const gradients = [];

        let item;
        let component;
        for (let i = 0, len = data.length; i < len; i++) {
            item = data[i];

            component = new RadialGradientComponent({
                color: item.color,
                alpha: item.alpha,
                size: item.size,
                hidden: this._hidden,
            });
            component.position.x = item.position.x;
            component.position.y = item.position.y;
            component.position.z = item.position.z;
            component.scale.x = item.scale.x;
            component.scale.y = item.scale.y;
            gradients.push(component);
            this.add(component);
        }

        this._gradients = gradients;
    }

    _removeGradients() {
        let item;
        for (let i = 0, len = this._gradients.length; i < len; i++) {
            item = this._gradients[i];
            this.remove(item);
            item.destroy();
        }
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Background gradients', { container: this._debugContainer });

        let item, group;
        for (let i = 0, len = this._gradients.length; i < len; i++) {
            item = this._gradients[i];

            group = debug.addGroup('gradient #' + (i + 1));
            group.add(item, 'visible');
            group.add(item, 'color');
            group.add(item, 'alpha', { min: 0, max: 1 });
            group.add(item, 'scale', { stepSize: 1 });
            group.add(item, 'position', { stepSize: 1 });
        }

        debug.addButton('Log debug info', {
            fullWidth: true,
            onClick: () => {
                this._logDebugInfo();
            },
        });
    }

    _logDebugInfo() {
        const info = [];

        let item;
        for (let i = 0, len = this._gradients.length; i < len; i++) {
            item = this._gradients[i];

            info.push({
                color: item.color,
                alpha: item.alpha,
                size: item.size,
                scale: item.scale,
                position: {
                    x: item.position.x,
                    y: item.position.y,
                    z: item.position.z,
                },
            });
        }

        console.log(JSON.stringify(info, null, 4));
    }
}
