// Vendor
import { CameraHelper, Object3D, PerspectiveCamera } from 'three';
import { component } from '@/utils/bidello';

// Components
import BranchParticlesComponent from '@/webgl/components/tree/BranchParticlesComponent';
import BranchEntityComponent from '@/webgl/components/tree/BranchEntityComponent';
import BranchAnchorsComponent from '@/webgl/components/tree/BranchAnchorsComponent';

const DEBUG = false;
const LENGTH = 5;

export default class BranchSubcategoryComponent extends component(Object3D) {
    init(options) {
        // Options
        this._scene = options.scene;
        this._data = options.data;
        this._colors = options.colors;
        this._cameraManager = options.cameraManager;

        // Props
        this._dataId = this._data.id;

        // Setup
        this._particles = this._createParticles();
        this._entities = this._createEntities();
        this._camera = this._createCamera();
        this._anchors = this._createAnchors();
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
    }

    hide() {
        this._particles.hide();
    }

    getEntity(id) {
        return this._entities.find(entity => entity.dataId === id);
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
        });
        this.add(particles);
        return particles;
    }

    _createEntities() {
        const entities = [];
        const data = this._data.entities;

        data.forEach((entity, index) => {
            const instance = new BranchEntityComponent({
                data: entity,
                scene: this._scene,
                colors: this._colors,
            });

            const direction = index % 2 === 0 ? 1 : -1;
            const spacing = 2;

            // instance.position.y = LENGTH * 0.5 + spacing * index - (((count - 1) * spacing) * 0.5);
            instance.position.y = LENGTH * 0.5;
            instance.rotation.z = Math.PI * 0.5 * direction;

            this.add(instance);
            entities.push(instance);
        });
        return entities;
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

    _createAnchors() {
        const anchors = new BranchAnchorsComponent({
            items: this._data.entities,
            length: LENGTH,
            cameraManager: this._cameraManager,
        });
        this.add(anchors);
        return anchors;
    }

    _showEntities() {
        this._entities.forEach(entity => entity.show());
    }

    _hideEntities() {
        this._entities.forEach(entity => entity.hide());
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._particles.update({ time, delta });
        this._entities.forEach(entity => entity.update({ time, delta }));
        this._anchors.update();
    }
}
