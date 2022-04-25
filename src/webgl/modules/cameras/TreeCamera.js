// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { PerspectiveCamera, Vector3 } from 'three';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import math from '@/utils/math/index';

export default class TreeCamera extends component() {
    init(options = {}) {
        // Props
        this._debugGroup = options.debug;
        this._position = options.position;
        this._rotation = options.rotation;

        // Setup
        this._config = undefined;
        this._debug = undefined;
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

    gotoCategory(name) {
        const config = TreeDataModel.getBranch(name).camera;

        const animation = {
            progress: 0,
        };

        const center = new Vector3(0, 5, 0);
        const maxRadius = this._position.z;

        const tween = gsap.to(animation, 10, {
            progress: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
                const radius = maxRadius - animation.progress * config.radiusOffset;
                const angle = Math.PI * 0.5 + Math.PI * config.angleOffset * animation.progress;
                const x = radius * Math.cos(angle);
                const y = this._position.y + 4 * animation.progress;
                const z = radius * Math.sin(angle);
                this._camera.position.set(x, y, z);

                center.y = y;
                this._camera.lookAt(center);
            },
        });
        return tween;
    }

    gotoSubcategory(index) {
        const animation = {
            progress: 0,
        };

        let targetY = this._camera.position.y;
        targetY += (index + 1) * 5;

        return gsap.to(animation, 1, {
            progress: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
                const y = math.lerp(this._camera.position.y, targetY, animation.progress);
                this._camera.position.y = y;
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
        this._debug.add(this._camera, 'position');
        this._debug.add(this._camera, 'rotation');
    }

    hideDebug() {
        this._debug?.remove();
    }
}
