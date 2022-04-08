// Vendor
import { component } from '@/utils/bidello';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class OrbitCamera extends component() {
    init(options = {}) {
        // Props
        this._debugGroup = options.debug;
        this._debug = null;
        this._position = options.position || new Vector3(0, 0, 100);

        // Setup
        this._isEnabled = null;
        this._camera = this._createCamera();
        this._controls = this._createCameraControls();
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
        this._controls.enabled = true;
    }

    disable() {
        this._isEnabled = false;
        this._controls.enabled = false;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCamera(50, 1, 0.1, 1000);

        const savedPosition = JSON.parse(localStorage.getItem('camera-orbit-position'));
        if (savedPosition) {
            camera.position.x = savedPosition.x;
            camera.position.y = savedPosition.y;
            camera.position.z = savedPosition.z;
        } else {
            camera.position.copy(this._position);
        }

        return camera;
    }

    _createCameraControls() {
        const controls = new OrbitControls(this._camera, this.$renderer.domElement);
        controls.screenSpacePanning = true;
        // controls.enableZoom = false;

        const savedTarget = JSON.parse(localStorage.getItem('camera-orbit-target'));
        if (savedTarget) {
            controls.target.x = savedTarget.x;
            controls.target.y = savedTarget.y;
            controls.target.z = savedTarget.z;
        }

        controls.update();

        return controls;
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

        this._debug = this._debugGroup.addGroup('Orbit');
        this._debug.add(this._controls, 'enableZoom', { label: 'zoom' });
        this._debug.add(this._camera, 'near', { onChange: updateCamera });
        this._debug.add(this._camera, 'far', { onChange: updateCamera });
        this._debug.add(this._camera, 'fov', { onChange: updateCamera });
        this._debug.addButton('Save position', {
            fullWidth: true,
            onClick: () => {
                localStorage.setItem('camera-orbit-position', JSON.stringify(this._camera.position));
                localStorage.setItem('camera-orbit-target', JSON.stringify(this._controls.target));
            },
        });
        this._debug.addButton('Reset position', {
            fullWidth: true,
            onClick: () => {
                localStorage.removeItem('camera-orbit-position');
                localStorage.removeItem('camera-orbit-target');
                this._camera.position.copy(this._position);
                this._controls.target.set(0, 0, 0);
                this._controls.update();
            },
        });
    }

    hideDebug() {
        this._debug?.remove();
    }
}
