// Vendor
import { component } from '@/utils/bidello';
import { PerspectiveCamera, Scene, BoxBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import { ResourceManager } from 'resource-loader';

export default class HomeView extends component() {
    init(options = {}) {
        // Props
        this._config = options.config;

        // Setup
        this._resourceManager = this._createResourceManager();
        this._scene = this._createScene();
        this._camera = this._createCamera();

        // TMP
        const geometry = new BoxBufferGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        this._mesh = new Mesh(geometry, material);
        this._scene.add(this._mesh);
    }

    destroy() {
        super.destroy();
    }

    /**
     * Getters & Setters
     */
    get scene() {
        return this._scene;
    }

    get camera() {
        return this._camera;
    }

    /**
     * Public
     */
    show() {
    }

    hide(callback) {
    }

    prepare() {
    }

    /**
     * Private
     */
    _createResourceManager() {
        const resourceManager = new ResourceManager({
            namespace: 'HomeView',
        });
        return resourceManager;
    }

    _createScene() {
        const scene = new Scene();
        return scene;
    }

    _createCamera() {
        const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 10;
        return camera;
    }

    /**
     * Update
     */
    update() {
        this._mesh.rotation.x += 0.01;
        this._mesh.rotation.y += 0.01;
        this._mesh.rotation.z += 0.01;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeCamera(dimensions);
    }

    _resizeCamera({ renderWidth, renderHeight }) {
        this._camera.aspect = renderWidth / renderHeight;
        this._camera.updateProjectionMatrix();
    }
}
