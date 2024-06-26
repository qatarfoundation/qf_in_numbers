// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import {
    CameraHelper,
    Object3D,
    PerspectiveCamera,
    Quaternion,
    Vector2,
    Vector3,
} from 'three';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import math from '@/utils/math/index';
import degreesToRadians from '@/utils/number/degreesToRadians';

// Constants
const Y_OFFSET = 2;

export default class TreeCamera extends component() {
    init(options = {}) {
        // Props
        this._debugGroup = options.debug;
        this._position = options.position;
        this._target = options.target;
        this._scene = options.scene;

        // Setup
        this._mousePosition = new Vector2();
        this._config = undefined;
        this._debug = undefined;
        this._isEnabled = false;
        this._currentBranch = undefined;
        this._categoryProgress = 0;
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
        const animation = {
            progress: 0,
        };

        const positionStart = new Vector3();
        const rotationStart = new Quaternion();

        rotationStart.copy(this._camera.quaternion);
        positionStart.copy(this._camera.position);

        this._gotoOverviewAnimation = gsap.to(animation, {
            progress: 1,
            duration: 3,
            ease: 'power3.inOut',
            onUpdate: () => {
                this._camera.position.lerpVectors(positionStart, this._position, animation.progress);
                this._camera.quaternion.slerpQuaternions(rotationStart, this._quaternion, animation.progress);
            },
        });

        return this._gotoOverviewAnimation;
    }

    gotoPosition(position) {
        const animation = {
            progress: 0,
        };

        const positionStart = this._camera.position.clone();
        const positionEnd = position.origin;
        const distance = positionStart.distanceTo(positionEnd);

        const rotationStart = this._camera.quaternion.clone();
        const rotationEnd = new Quaternion();

        // const duration = math.clamp(2 * (distance / 3), 1.5, 5.5);
        const duration = 0.1;

        this._gotoOverviewAnimation?.kill();
        this._gotoCategoryAnimation?.kill();
        this._gotoCamera?.kill();

        this._gotoPositionAnimation = gsap.to(animation, {
            duration,
            progress: 1,
            ease: 'power3.inOut',
            onUpdate: () => {
                this._camera.position.lerpVectors(positionStart, positionEnd, animation.progress);

                position.camera.getWorldQuaternion(rotationEnd);
                this._camera.quaternion.slerpQuaternions(rotationStart, rotationEnd, animation.progress);
            },
        });

        return this._gotoPositionAnimation;
    }

    gotoCamera(camera) {
        const animation = {
            progress: 0,
        };

        const positionStart = this._camera.position.clone();
        const positionEnd = new Vector3();
        camera.getWorldPosition(positionEnd);

        const rotationStart = this._camera.quaternion.clone();
        const rotationEnd = new Quaternion();
        camera.getWorldQuaternion(rotationEnd);

        // const distance = positionStart.distanceTo(positionEnd);
        // const duration = math.clamp(2 * (distance / 3), 1.5, 5.5);
        const duration = 3.1;

        this._gotoOverviewAnimation?.kill();
        this._gotoCategoryAnimation?.kill();
        this._gotoCamera?.kill();

        this._gotoCamera = gsap.to(animation, {
            duration,
            progress: 1,
            ease: 'power3.inOut',
            onUpdate: () => {
                this._camera.position.lerpVectors(positionStart, positionEnd, animation.progress);
                this._camera.quaternion.slerpQuaternions(rotationStart, rotationEnd, animation.progress);
            },
        });

        return this._gotoCamera;
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

        if (this._target) camera.lookAt(this._target);
        this._quaternion = new Quaternion();
        this._quaternion.copy(camera.quaternion);

        return camera;
    }

    _createHelper() {
        const helper = new CameraHelper(this._camera);
        helper.visible = false;
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
        // this._debug.add(this._camera, 'rotation');
        this._debug.add(this._target, 'y', {
            onChange: () => {
                this._camera.lookAt(this._target);
            },
        });
    }

    hideDebug() {
        this._helper.visible = true;
        this._debug?.remove();
    }
}
