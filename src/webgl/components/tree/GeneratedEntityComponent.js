// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { AdditiveBlending, BoxBufferGeometry, BufferGeometry, Color, InstancedBufferAttribute, InstancedMesh, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneBufferGeometry, ShaderMaterial, Vector3 } from 'three';

// Hooks
import useStore from '@/hooks/useStore';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import randomArbitrary from '@/utils/math/randomArbitrary';
import Breakpoints from '@/utils/Breakpoints';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles-big/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles-big/fragment.glsl';

// Constants
const LENGTH = 1.5;
const DEBUG = false;

export default class GeneratedEntityComponent extends component(Object3D) {
    init(options) {
        // Options
        this._id = options.id;
        this._data = options.data;
        this._scene = options.scene;
        this._cameraManager = options.cameraManager;
        this._color = options.color;

        // Props
        this._labelAnchorScreenSpacePosition = new Vector3();
        this._buttonAnchorScreenSpacePosition = new Vector3();
        this._highlightAnchorScreenSpacePosition = new Vector3();

        // Setup
        this._startPosition = new Vector3();
        this._endPosition = this._createEndPosition();
        if (DEBUG) this._skeleton = this._createSkeleton();
        this._cameraSide = this._chooseCameraSide(useStore.getState().locale);
        this._cameraTarget = this._createCameraTarget();
        this._cameraPosition = this._createCameraPosition();
        this._camera = this._createCamera();
        this._labelAnchor = this._createLabelAnchor();
        this._buttonAnchor = this._createButtonAnchor();
        this._highlightAnchor = this._createHighlightAnchor();
        this._bigParticles = this._createBigParticles();
        this._addToModel();
        this._bindHandler();
        this._setupEventListeners();
    }

    destroy() {
        this._timelineShow?.kill();
        this._timelineHide?.kill();
        this._removeEventListeners();
    }

    /**
     * Getters & Setters
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
     * Public
     */
    show() {
        this._timelineShow = new gsap.timeline();
        this._timelineShow.set(this._bigParticles, { visible: true });
        this._timelineShow.to(this._bigParticles.material.uniforms.uOpacity, { duration: 1, value: 1 }, 0);
        return this._timelineShow;
    }

    hide() {
        this._timelineHide = new gsap.timeline({
            onComplete: () => {
                this._bigParticles.visible = false;
            },
        });
        this._timelineHide.to(this._bigParticles.material.uniforms.uOpacity, { duration: 1, value: 0 }, 0);
        return this._timelineHide;
    }

    /**
     * Private
     */
    _bindHandler() {
        this._languageChangeHandler = this._languageChangeHandler.bind(this);
    }

    _setupEventListeners() {
        this.$root.addEventListener('language:change', this._languageChangeHandler);
    }

    _removeEventListeners() {
        this.$root.removeEventListener('language:change', this._languageChangeHandler);
    }

    _chooseCameraSide(locale) {
        const side = locale === 'ar-QA' ? -1 : 1;
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
        const alpha = Breakpoints.active('small') ? 0.8 : 0.5;
        const target = new Vector3().lerpVectors(this._startPosition, this._endPosition, alpha);

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
        const distance = Breakpoints.active('small') ? 5 : 2;
        position.z += distance * this._cameraSide;

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

    _createButtonAnchor() {
        const position = new Vector3().lerpVectors(this._startPosition, this._endPosition, 0.7);
        const anchor = new Object3D();
        anchor.position.copy(position);
        anchor.position.y -= 0.15;
        this.add(anchor);

        if (DEBUG) {
            const geometry = new BoxBufferGeometry(0.01, 0.01, 0.01);
            const material = new MeshBasicMaterial({ color: 0xffff00 });
            const mesh = new Mesh(geometry, material);
            anchor.add(mesh);
        }

        return anchor;
    }

    _createHighlightAnchor() {
        const position = new Vector3().lerpVectors(this._startPosition, this._endPosition, randomArbitrary(0.3, 0.9));
        const anchor = new Object3D();
        anchor.position.copy(position);
        anchor.position.y += 0.2;
        this.add(anchor);

        if (DEBUG) {
            const geometry = new BoxBufferGeometry(0.01, 0.01, 0.01);
            const material = new MeshBasicMaterial({ color: 0xff00ff });
            const mesh = new Mesh(geometry, material);
            anchor.add(mesh);
        }

        return anchor;
    }

    _createBigParticles() {
        const charts = this._data.charts || [];
        const amount = charts.length;

        const startPosition = this._startPosition;
        const endPosition = this._endPosition;

        const sizes = [];

        for (let i = 0; i < amount; i++) {
            sizes.push(randomArbitrary(0.2, 1));
        }

        const geometry = new PlaneBufferGeometry(1.0, 1.0);
        geometry.setAttribute('size', new InstancedBufferAttribute(new Float32Array(sizes), 1));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColor: { value: new Color(this._color) },
                uPointSize: { value: 0.15 },
                uInnerGradient: { value: 0.1 },
                uOuterGradient: { value: 0 },
                uOpacity: { value: 0 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        const mesh = new InstancedMesh(geometry, material, amount);
        mesh.visible = false;
        this.add(mesh);

        const offset = 0.2;
        const dummy = new Object3D();
        for (let i = 0; i < amount; i++) {
            const step = 0.95 - (i / amount) * (1 - offset);
            const position = new Vector3().lerpVectors(startPosition, endPosition, step);
            dummy.position.copy(position);
            dummy.position.y += (Math.random() * 2 - 1) * 0.2;
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        return mesh;
    }

    _addToModel() {
        TreeDataModel.addEntity(this._id);
    }

    /**
     * Update
     */
    update() {
        this._updateLabelAnchorScreenSpacePosition();
        this._updateButtonAnchorScreenSpacePosition();
        this._updateHighlightAnchorScreenSpacePosition();
    }

    _updateLabelAnchorScreenSpacePosition() {
        this._labelAnchorScreenSpacePosition.setFromMatrixPosition(this._labelAnchor.matrixWorld);
        this._labelAnchorScreenSpacePosition.project(this._cameraManager.camera);
        this._labelAnchorScreenSpacePosition.x = (this._labelAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._labelAnchorScreenSpacePosition.y = -(this._labelAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateEntityLabelPosition(this._id, this._labelAnchorScreenSpacePosition, this._cameraSide);
    }

    _updateButtonAnchorScreenSpacePosition() {
        this._buttonAnchorScreenSpacePosition.setFromMatrixPosition(this._buttonAnchor.matrixWorld);
        this._buttonAnchorScreenSpacePosition.project(this._cameraManager.camera);
        this._buttonAnchorScreenSpacePosition.x = (this._buttonAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._buttonAnchorScreenSpacePosition.y = -(this._buttonAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateEntityButtonPosition(this._id, this._buttonAnchorScreenSpacePosition);
    }

    _updateHighlightAnchorScreenSpacePosition() {
        this._highlightAnchorScreenSpacePosition.setFromMatrixPosition(this._highlightAnchor.matrixWorld);
        this._highlightAnchorScreenSpacePosition.project(this._cameraManager.camera);
        this._highlightAnchorScreenSpacePosition.x = (this._highlightAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._highlightAnchorScreenSpacePosition.y = -(this._highlightAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateEntityHighlightPosition(this._id, this._highlightAnchorScreenSpacePosition);
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
    }

    /**
     * Handlers
     */
    _languageChangeHandler(language) {
        this._cameraSide = this._chooseCameraSide(language);
        this._cameraPosition = this._createCameraPosition();
        this._camera = this._createCamera();
    }
}
