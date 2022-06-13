// Vendor
import { component } from '@/utils/bidello';
import { BoxBufferGeometry, BufferGeometry, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Vector3 } from 'three';

// Constants
const LENGTH = 1;
const DEBUG = false;

export default class GeneratedEntityComponent extends component(Object3D) {
    init(options) {
        // Options
        this._slug = options.slug;
        this._scene = options.scene;

        // Setup
        this._startPosition = new Vector3();
        this._endPosition = this._createEndPosition();
        if (DEBUG) this._skeleton = this._createSkeleton();
        this._cameraTarget = this._createCameraTarget();
        this._cameraPosition = this._createCameraPosition();
        this._camera = this._createCamera();
    }

    /**
     * Public
     */
    get slug() {
        return this._slug;
    }

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
        position.z += 2 * (Math.random() > 0.5 ? 1 : -1);

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
}
