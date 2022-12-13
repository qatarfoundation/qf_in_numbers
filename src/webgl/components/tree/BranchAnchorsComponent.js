// Vendor
import { component } from '@/utils/bidello';
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';

// Utils
import Anchors from '@/webgl/utils/Anchors';

const DEBUG = false;
const ANCHOR_LIMIT = 4;

export default class BranchAnchorsComponent extends component(Object3D) {
    init(options) {
        // Options
        this._items = options.items;
        this._length = options.length;
        this._cameraManager = options.cameraManager;

        // Setup
        this._anchors = this._createAnchors();
    }

    _createAnchors() {
        const anchors = [];
        const spread = { x: 0.4, y: 0.8 };

        const items = this._items.slice(0, ANCHOR_LIMIT).reverse();
        items.forEach((item, index) => {
            const side = (index % 2 === 0 ? -1 : 1);
            const x = spread.x * side;
            const y = this._length * 0.5 + spread.y * index - ((items.length - 1) * spread.y) * 0.5;
            const z = 0;
            const position = new Vector3(x, y, z);

            const object = new Object3D();
            object.position.copy(position);
            this.add(object);

            if (DEBUG) {
                const geometry = new BoxGeometry(0.1, 0.1, 0.1);
                const material = new MeshBasicMaterial({ color: 0xff0000 });
                const mesh = new Mesh(geometry, material);
                mesh.position.copy(position);
                this.add(mesh);
            }

            const anchor = {
                id: item.uuid,
                object,
                side,
                screenPosition: new Vector3(),
            };

            anchors.push(anchor);
            Anchors.add(anchor);
        });
        return anchors;
    }

    /**
     * Update
     */
    update() {
        this._anchors.forEach(anchor => {
            anchor.screenPosition.setFromMatrixPosition(anchor.object.matrixWorld);
            anchor.screenPosition.project(this._cameraManager.camera);
            anchor.screenPosition.x = (anchor.screenPosition.x * this._halfRenderWidth) + this._halfRenderWidth;
            anchor.screenPosition.y = -(anchor.screenPosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        });
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
    }
}
