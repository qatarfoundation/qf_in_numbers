// Vendor
import { CameraHelper, Object3D, PerspectiveCamera } from 'three';
import { component } from '@/utils/bidello';

// Components
import BranchParticlesComponent from '@/webgl/components/tree/BranchParticlesComponent';
import BranchSubcategoryComponent from '@/webgl/components/tree/BranchSubcategoryComponent';
import BranchAnchorsComponent from '@/webgl/components/tree/BranchAnchorsComponent';

const DEBUG = false;
const LENGTH = 5;

export default class BranchCategoryComponent extends component(Object3D) {
    init(options) {
        this._scene = options.scene;
        this._data = options.data;
        this._colors = options.colors;
        this._cameraManager = options.cameraManager;

        this._particles = this._createParticles();
        this._subcategories = this._createSubcategories();
        this._camera = this._createCamera();
        this._anchors = this._createAnchors();
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
    show() {
        this._particles.show();
        this._showSubcategories();
    }

    hide() {
        this._particles.hide();
        this._hideSubcategories();
    }

    getSubcategory(id) {
        return this._subcategories.find(subcategory => subcategory.dataId === id);
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

    _createSubcategories() {
        const subcategories = [];
        const data = this._data.subcategories;
        data.forEach((subcategory, index) => {
            const instance = new BranchSubcategoryComponent({
                data: subcategory,
                scene: this._scene,
                colors: this._colors,
                cameraManager: this._cameraManager,
            });
            instance.position.y = (index + 1) * LENGTH;
            this.add(instance);
            subcategories.push(instance);
        });
        return subcategories;
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
            items: this._data.subcategories,
            length: LENGTH,
            cameraManager: this._cameraManager,
        });
        this.add(anchors);
        return anchors;
    }

    _showSubcategories() {
        this._subcategories.forEach(subcategory => subcategory.show());
    }

    _hideSubcategories() {
        this._subcategories.forEach(subcategory => subcategory.hide());
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._particles.update({ time, delta });
        this._subcategories.forEach(category => category.update({ time, delta }));
        this._anchors.update();
    }
}
