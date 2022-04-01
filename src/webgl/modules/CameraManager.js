// Vendor
import { component } from '@/utils/bidello';

// Utils
import Debugger from '@/utils/Debugger';

// Camera's
import DefaultCamera from '@/webgl/modules/cameras/DefaultCamera';
import OrbitCamera from '@/webgl/modules/cameras/OrbitCamera';

// Constants
const CAMERAS = {
    default: DefaultCamera,
};

export default class CameraManager extends component() {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;
        this._position = options.position;
        this._scene = options.scene;
        this._type = options.type || 'default';
        this._orbit = options.orbit;

        // Props
        this._active = false;

        // Setup
        this._debug = this._createDebug();
        this._cameras = this._createCameras();
        this._main = this._cameras[this._type];
        this._activate();
        this._setupDebugTypes();
    }

    /**
     * Getters & Setters
     */
    get main() {
        return this._main;
    }

    get active() {
        return this._active;
    }

    get camera() {
        return this._active.camera;
    }

    get orbit() {
        return this._cameras.orbit;
    }

    /**
     * Private
     */
    _createCameras() {
        const cameras = {};

        const params = {
            debug: this._debug,
            position: this._position,
            scene: this._scene,
        };

        cameras.orbit = new OrbitCamera(params);
        cameras[this._type] = new CAMERAS[this._type](params);
        cameras[this._type].type = this._type;

        return cameras;
    }

    _activate() {
        if (this._orbit) {
            this._active = this._cameras.orbit;
        } else {
            this._active = this._cameras[this._type];
        }
        this._active.enable();
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger || !this._debugContainer) return;
        const debug = Debugger.addGroup('Camera', { container: this._debugContainer });
        return debug;
    }

    _setupDebugTypes() {
        if (!this._debug) return;

        const types = {
            'orbit': this._cameras.orbit,
        };
        types[this._type] = this._cameras[this._type];

        this._debug.add(this, '_active', {
            label: 'active',
            options: types,
            onChange: () => {
                let item;
                for (const key in types) {
                    item = types[key];
                    if (this._active === item) {
                        item.enable();
                        item.showDebug();
                    } else {
                        item.disable();
                        item.hideDebug();
                    }
                }
            },
        });

        this._active.showDebug();
    }
}
