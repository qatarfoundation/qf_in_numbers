// Vendor
import { component } from '@/utils/bidello';
import { PerspectiveCamera, Vector3 } from 'three';

export default class DefaultCamera extends component() {
    init(options = {}) {
        // Props
        this._debugGroup = options.debug;
        this._position = options.position;

        // Setup
        this._debug = null;
        this._isEnabled = false;
        this._camera = this._createCamera();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._camera;
    }

    /**
     * Public
     */
    enable() {
        this._isEnabled = true;
    }

    disable() {
        this._isEnabled = false;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCamera(44.5, 1, 0.1, 1000);
        if (this._position) {
            camera.position.copy(this._position);
        } else {
            camera.position.z = 250;
        }

        return camera;
    }

    /**
     * Update
     */
    onUpdate({ time }) {
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight }) {
        this._camera.aspect = renderWidth / renderHeight;
        this._camera.updateProjectionMatrix();
    }

    /**
     * Debug
     */
    showDebug() {
        if (!this._debugGroup) return;

        const _this = this;
        function updateCamera() {
            _this._camera.updateProjectionMatrix();
        }

        this._debug = this._debugGroup.addGroup('Main');
        this._debug.add(this._camera, 'near', { onChange: updateCamera });
        this._debug.add(this._camera, 'far', { onChange: updateCamera });
        this._debug.add(this._camera, 'fov', { onChange: updateCamera });

        const position = this._debug.addGroup('Position');
        position.add(this._camera, 'position');
    }

    hideDebug() {
        this._debug?.remove();
    }
}
