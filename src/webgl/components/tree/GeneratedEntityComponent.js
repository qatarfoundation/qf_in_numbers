// Vendor
import { component } from '@/utils/bidello';
import { BoxBufferGeometry, BufferGeometry, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Vector3 } from 'three';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// Constants
const LENGTH = 1.5;
const DEBUG = false;

export default class GeneratedEntityComponent extends component(Object3D) {
    init(options) {
        // Options
        this._id = options.id;
        this._scene = options.scene;
        this._cameraManager = options.cameraManager;

        // Setup
        this._labelAnchorScreenSpacePosition = new Vector3();
        this._startPosition = new Vector3();
        this._endPosition = this._createEndPosition();
        if (DEBUG) this._skeleton = this._createSkeleton();
        this._cameraSide = this._chooseCameraSide();
        this._cameraTarget = this._createCameraTarget();
        this._cameraPosition = this._createCameraPosition();
        this._camera = this._createCamera();
        this._labelAnchor = this._createLabelAnchor();
        this._addToModel();
    }

    /**
     * Public
     */
    get cameraAnchor() {
        return {
            origin: this._getCameraOrigin(),
            camera: this._camera,
        };
    }

    get startPosition() {
        const startPosition = this.position;
        return startPosition;
    }

    get endPosition() {
        const positionMatrix = new Matrix4();
        positionMatrix.setPosition(this._endPosition);

        this.updateMatrix();
        const matrix = new Matrix4();
        matrix.copy(this.matrix);
        matrix.multiply(positionMatrix);

        const endPosition = new Vector3();
        endPosition.setFromMatrixPosition(matrix);

        return endPosition;
    }

    /**
     * Private
     */
    _chooseCameraSide() {
        const side = Math.random() > 0.5 ? 1 : -1;
        return side;
    }

    _createEndPosition() {
        const endPosition = this._startPosition.clone();
        endPosition.x += LENGTH;
        endPosition.y += 0.75;
        return endPosition;
    }

    _createSkeleton() {
        const points = [this._startPosition, this._endPosition];
        const material = new LineBasicMaterial({ color: 0xff0000 });
        const geometry = new BufferGeometry().setFromPoints(points);
        const line = new LineSegments(geometry, material);
        this.add(line);
        return line;
    }

    _createCameraTarget() {
        const target = new Vector3().lerpVectors(this._startPosition, this._endPosition, 0.5);

        if (DEBUG) {
            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0x00ff00 });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(target);
            this.add(mesh);
        }

        return target;
    }

    _createCameraPosition() {
        const position = this._cameraTarget.clone();
        position.z += 2 * this._cameraSide;

        if (DEBUG) {
            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0xff00ff });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(position);
            this.add(mesh);
        }

        return position;
    }

    _createCamera() {
        const camera = new PerspectiveCamera(50, 1, 0.1, 1);
        camera.position.copy(this._cameraPosition);
        camera.lookAt(this._cameraTarget);
        this.add(camera);
        return camera;
    }

    _getCameraOrigin() {
        const origin = new Vector3();
        this._camera.getWorldPosition(origin);
        return origin;
    }

    _createLabelAnchor() {
        const position = this._endPosition;
        const anchor = new Object3D();
        anchor.position.copy(position);
        this.add(anchor);

        if (DEBUG) {
            const geometry = new BoxBufferGeometry(0.01, 0.01, 0.01);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            anchor.add(mesh);
        }

        return anchor;
    }

    _addToModel() {
        TreeDataModel.addEntity(this._id);
    }

    /**
     * Update
     */
    update() {
        this._updateLabelAnchorScreenSpacePosition();
    }

    _updateLabelAnchorScreenSpacePosition() {
        this._labelAnchorScreenSpacePosition.setFromMatrixPosition(this._labelAnchor.matrixWorld);
        this._labelAnchorScreenSpacePosition.project(this._cameraManager.camera);
        this._labelAnchorScreenSpacePosition.x = (this._labelAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._labelAnchorScreenSpacePosition.y = -(this._labelAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateEntityLabelPosition(this._id, this._labelAnchorScreenSpacePosition, this._cameraSide);
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
    }
}
