// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { ArrowHelper, BoxBufferGeometry, CameraHelper, ConeGeometry, Euler, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, Vector3 } from 'three';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import math from '@/utils/math/index';

export default class TreeCamera extends component() {
    init(options = {}) {
        // Props
        this._debugGroup = options.debug;
        this._position = options.position;
        this._rotation = options.rotation;
        this._scene = options.scene;

        // Setup
        this._config = undefined;
        this._debug = undefined;
        this._isEnabled = false;
        this._currentBranch = undefined;
        this._categoryProgress = 0;
        this._target = new Vector3();
        this._camera = this._createCamera();
        this._helper = this._createHelper();
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

    gotoOverview() {
        const config = this._currentBranch?.camera;
        if (!config) return;

        const center = new Vector3(0, 5, 0);
        const maxRadius = this._position.z;

        const tween = gsap.to(this, 10, {
            _categoryProgress: 0,
            ease: 'power2.inOut',
            onUpdate: () => {
                const radius = maxRadius - this._categoryProgress * config.radiusOffset;
                const angle = Math.PI * 0.5 + Math.PI * config.angleOffset * this._categoryProgress;
                const x = radius * Math.cos(angle);
                const y = this._position.y + 4 * this._categoryProgress;
                const z = radius * Math.sin(angle);
                this._camera.position.set(x, y, z);

                center.y = y;

                this._target.copy(center);

                this._camera.lookAt(center);
            },
        });
        return tween;
    }

    gotoCategory(name) {
        this._currentBranch = TreeDataModel.getBranch(name);
        const config = this._currentBranch.camera;

        const center = new Vector3(0, 5, 0);
        const maxRadius = this._position.z;

        const tween = gsap.to(this, 10, {
            _categoryProgress: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
                const radius = maxRadius - this._categoryProgress * config.radiusOffset;
                const angle = Math.PI * 0.5 + Math.PI * config.angleOffset * this._categoryProgress;
                const x = radius * Math.cos(angle);
                const y = this._position.y + 4 * this._categoryProgress;
                const z = radius * Math.sin(angle);
                this._camera.position.set(x, y, z);

                this._target.copy(center);

                center.y = y;
                this._camera.lookAt(center);
            },
        });
        return tween;
    }

    gotoSubcategory(position) {
        const animation = {
            progress: 0,
        };

        const positionStart = this._camera.position.clone();
        const positionEnd = position.origin;

        const targetStart = this._target.clone();
        const targetEnd = position.target;

        const quatStart = new Quaternion();
        quatStart.setFromEuler(this._camera.rotation);
        // quatStart.setFromEuler(new Euler(0, 0, 0));

        const centerRadius = positionEnd.distanceTo(targetEnd);

        const directionStart = positionStart.clone().sub(targetStart).normalize();
        const directionEnd = positionEnd.clone().sub(targetEnd).normalize();
        const directionCenter = new Vector3().lerpVectors(directionStart, directionEnd, 0.5).normalize();

        // const direction = position.target.clone().sub(this._camera.position).normalize();

        const direction = new Vector3(); // create once an reuse it
        direction.subVectors(position.origin, position.target).normalize();

        console.log(direction);

        const dir = new Euler();
        dir.setFromVector3(direction);
        // dir.setFromVector3(new Euler(0, Math.PI * 0.5, 0));

        const quatEnd = new Quaternion();
        quatEnd.setFromEuler(dir);

        const arrowHelper = new ArrowHelper(this._camera.rotation, positionEnd, 1, 0xff0000);
        this._scene.add(arrowHelper);

        {
            const arrowHelper = new ArrowHelper(dir, positionEnd, 1, 0x00ff00);
            this._scene.add(arrowHelper);
        }

        // const geometry = new BoxBufferGeometry(0.5, 0.5, 0.5);
        // const material = new MeshBasicMaterial({ color: 0x00ffff });
        // const mesh = new Mesh(geometry, material);

        const pos = directionCenter.clone().add(positionEnd);
        // mesh.position.copy(pos);

        // this._scene.add(mesh);

        const targetCenter = new Vector3(targetStart, targetEnd, 0.5);
        // targetCenter.x =

        // console.log(centerRadius);

        return gsap.to(animation, 2, {
            progress: 1,
            ease: 'power3.inOut',
            onUpdate: () => {
                this._camera.position.lerpVectors(positionStart, positionEnd, animation.progress);
                // this._target.lerpVectors(targetStart, targetEnd, animation.progress);

                const q = new Quaternion().slerpQuaternions(quatStart, quatEnd, animation.progress);
                // this._camera.rotation.setRotationFromQuaternion(q);
                this._camera.setRotationFromQuaternion(q);

                // this._camera.lookAt(this._target);
            },
        });
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

        if (this._rotation) camera.rotation.copy(this._rotation);

        return camera;
    }

    _createHelper() {
        const helper = new CameraHelper(this._camera);
        this._scene.add(helper);
        return helper;
    }

    /**
     * Update
     */
    onUpdate({ time }) {
        this._camera.updateMatrixWorld();
        this._helper.update();
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

        this._helper.visible = false;

        this._debug = this._debugGroup.addGroup('Main');
        this._debug.add(this._camera, 'near', { onChange: updateCamera });
        this._debug.add(this._camera, 'far', { onChange: updateCamera });
        this._debug.add(this._camera, 'fov', { onChange: updateCamera });
        this._debug.add(this._camera, 'position');
        this._debug.add(this._camera, 'rotation');
    }

    hideDebug() {
        this._helper.visible = true;
        this._debug?.remove();
    }
}
