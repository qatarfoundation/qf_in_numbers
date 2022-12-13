// Vendor
import { gsap } from 'gsap';
import { CameraHelper, Object3D, PerspectiveCamera } from 'three';
import { component } from '@/utils/bidello';

// Components
import BranchParticlesComponent from '@/webgl/components/tree/BranchParticlesComponent';

const DEBUG = false;
const LENGTH = 8;

export default class BranchEntityComponent extends component(Object3D) {
    init(options) {
        // Options
        this._scene = options.scene;
        this._data = options.data;
        this._colors = options.colors;

        // Props
        this._dataId = this._data.id;

        // Setup
        this._particles = this._createParticles();
        this._camera = this._createCamera();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._camera;
    }

    get dataId() {
        return this._dataId;
    }

    /**
     * Public
     */
    show() {
        this._particles.show();
        return gsap.to(this._particles, { duration: 5, progress: 1 });
    }

    hide() {
        this._particles.hide();
        return gsap.to(this._particles, { duration: 1, progress: 0 });
    }

    /**
     * Private
     */
    _createParticles() {
        const particles = new BranchParticlesComponent({
            length: LENGTH,
            size: 0.5,
            amount: 100,
            colors: this._colors,
            progress: 0,
        });

        this.add(particles);
        return particles;
    }

    _createCamera() {
        const camera = new PerspectiveCamera(50, 1, 0.1, 1);
        camera.position.z = 5;
        camera.position.y = LENGTH * 0.5;
        this.add(camera);

        if (DEBUG) {
            const cameraHelper = new CameraHelper(camera);
            this._scene.add(cameraHelper);
        }

        return camera;
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._particles.update({ time, delta });
    }
}
