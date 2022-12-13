// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { AdditiveBlending, BoxBufferGeometry, BoxGeometry, BufferGeometry, CameraHelper, CatmullRomCurve3, InstancedBufferAttribute, InstancedMesh, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneBufferGeometry, ShaderMaterial, Vector3 } from 'three';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import math from '@/utils/math';
import Breakpoints from '@/utils/Breakpoints';

// Components
import GeneratedEntityComponent from '@/webgl/components/tree/GeneratedEntityComponent';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles-generated/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles-generated/fragment.glsl';

// Constants
const PARTICLE_SIZE = 0.26;
const DEBUG = true;
const CATEGORY_Y = 5;

export default class GeneratedBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._index = options.index;
        this._data = options.data;
        this._scene = options.scene;
        this._colors = options.colors;
        this._cameraManager = options.cameraManager;

        // Props
        this._isActive = false;
        this._entities = {};
        this._particlesMat = null;

        // Setup
        this._debug = this._createDebug(options.debug);
        this.hide();
    }

    setup() {
        this._points = this._createPoints();
        this._curves = this._createCurves();
        this._particles = this._createParticles();
        this._cameraAnchorCategory = this._createCameraAnchorCategory();
        this._cameraAnchorsSubcategories = this._createCameraAnchorsSubcategories();
        this._subcategoriesLabelAnchors = this._createSubcategoriesLabelAnchors();

        if (DEBUG) this._createDebugSkeleton();
    }

    destroy() {
        super.destroy();
        this._destroyEntities();
    }

    /**
     * Public
     */
    show() {
        this._isActive = true;
        return gsap.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: 0.7, ease: 'sine.inOut' });
    }

    hide() {
        this._isActive = false;
        if (this._particles) return gsap.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: 0 });
    }

    transitionOut() {
        this._isActive = false;
        if (this._particles) return gsap.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: 0 });
    }

    getCameraAnchorCategory() {
        return this._cameraAnchorCategory;
    }

    getCameraAnchorSubcategory(name) {
        return this._cameraAnchorsSubcategories[name];
    }

    getEntity(name) {
        return this._entities[name];
    }

    /**
     * Private
     */

    _createPoints() {
        const pointsCategories = [];

        // Trunk
        pointsCategories.push(new Vector3(0, 0, 0));

        const currentPosition = new Vector3(0, 13, 0);
        pointsCategories.push(currentPosition);

        const startPosition = currentPosition.clone();

        const subcategoriesPoints = [];
        const subcategoriesEntries = {};

        const entitiesPoints = [];
        const entitiesEntries = {};

        // Subcategories
        const subcategories = this._data.subcategories;
        const subcategoriesLength = subcategories.length;
        const angleStep = (Math.PI * 2) / subcategoriesLength;
        subcategories.forEach((subcategory, index) => {
            const radius = 0;
            const angle = 0;

            // Start position
            subcategoriesPoints.push(startPosition.clone());

            // End position
            const lengthMultiplier = Breakpoints.active('small') ? 1.5 : 1;
            const length = subcategory.entities.length * lengthMultiplier;
            const x = startPosition.x + radius * Math.cos(angle);
            const y = startPosition.y + length;
            const z = startPosition.z + radius * Math.sin(angle);
            const endPosition = new Vector3(x, y, z);
            subcategoriesPoints.push(endPosition.clone());

            subcategoriesEntries[subcategory.id] = {
                start: startPosition.clone(),
                end: endPosition.clone(),
            };

            const direction = new Vector3();
            direction.subVectors(endPosition, startPosition);
            direction.normalize();

            const entities = subcategory.entities;
            const entitiesLength = entities.length;
            const points = [startPosition, endPosition];
            const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0);

            entities.forEach((entity, index) => {
                const step = (index + 1) / (entitiesLength + 1);

                const startPosition = curve.getPointAt(step);
                entitiesPoints.push(startPosition);

                const slug = entity.slug.split('/').slice(-1)[0];

                const entityComponent = new GeneratedEntityComponent({
                    id: entity.slug,
                    data: entity,
                    scene: this._scene,
                    cameraManager: this._cameraManager,
                    color: this._colors.primary,
                });
                entityComponent.position.copy(startPosition);
                entityComponent.rotation.y = Math.PI * 2 * Math.random();
                this.add(entityComponent);
                this._entities[slug] = entityComponent;
            });

            startPosition.copy(endPosition);
            // startPosition.y += 1;
        });

        return {
            categories: pointsCategories,
            subcategories: {
                all: subcategoriesPoints,
                entries: subcategoriesEntries,
            },
            // entities: {
            //     all: [],
            //     entries: [],
            // },
        };
    }

    _createDebugSkeleton() {
        {
            const material = new LineBasicMaterial({ color: 0x0000ff });
            const geometry = new BufferGeometry().setFromPoints(this._points.categories);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }

        {
            const material = new LineBasicMaterial({ color: 0x00ff00 });
            const geometry = new BufferGeometry().setFromPoints(this._points.subcategories.all);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }
    }

    _createCurves() {
        const entitiesPoints = this._getEntitiesPoints();

        const segments = [...this._points.categories, ...this._points.subcategories.all, ...entitiesPoints];
        const curves = [];

        for (let i = 0, len = segments.length; i < len; i += 2) {
            const start = segments[i + 0];
            const end = segments[i + 1];
            const points = [start, end];

            const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0);
            const frenetFrames = curve.computeFrenetFrames(points.length, false);
            const weight = start.distanceTo(end);

            curves.push({
                curve,
                frenetFrames,
                weight,
            });
        }

        return curves;
    }

    _getEntitiesPoints() {
        const points = [];
        for (const key in this._entities) {
            const entity = this._entities[key];
            points.push(entity.startPosition);
            points.push(entity.endPosition);
        }
        return points;
    }

    _createParticles() {
        const amount = 1800;
        const vertices = [];
        const normals = [];
        const settings = [];
        const colors = [];
        const displacement = [];

        for (let i = 0; i < amount; i++) {
            const data = this._getRandomCurve(this._curves);
            const curve = data.curve;

            const pointProgress = Math.random();
            const point = curve.getPointAt(pointProgress);

            const radius = math.randomArbitrary(0, 0.2);
            const angle = Math.random() * Math.PI * 2;

            const fract = pointProgress % 1;
            const indexStart = Math.floor(pointProgress * (data.frenetFrames.normals.length - 1));
            const indexEnd = Math.ceil(pointProgress * (data.frenetFrames.normals.length - 1));

            const N = new Vector3().lerpVectors(data.frenetFrames.normals[indexStart], data.frenetFrames.normals[indexEnd], fract);
            const B = new Vector3().lerpVectors(data.frenetFrames.binormals[indexStart], data.frenetFrames.binormals[indexEnd], fract);

            const sin = Math.sin(angle);
            const cos = -Math.cos(angle);

            const normal = new Vector3();
            normal.x = (cos * N.x + sin * B.x);
            normal.y = (cos * N.y + sin * B.y);
            normal.z = (cos * N.z + sin * B.z);
            normal.normalize();

            normals.push(normal.x, normal.y, normal.z);

            const vertex = new Vector3();
            vertex.x = point.x + radius * normal.x;
            vertex.y = point.y + radius * normal.y;
            vertex.z = point.z + radius * normal.z;

            vertices.push(vertex.x, vertex.y, vertex.z);

            settings.push(math.randomArbitrary(0.2, 1)); // Radius
            settings.push(math.randomArbitrary(0.5, 1)); // Scale
            settings.push(math.randomArbitrary(0.5, 1)); // Alpha

            colors.push(Math.random() > 0.5 ? 1 : 0);

            displacement.push(Math.random());
            displacement.push(Math.random());
        }

        const geometry = new PlaneBufferGeometry(0.2, 0.2);
        geometry.setAttribute('normal', new InstancedBufferAttribute(new Float32Array(normals), 3));
        geometry.setAttribute('settings', new InstancedBufferAttribute(new Float32Array(settings), 3));
        geometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 1));
        geometry.setAttribute('displacement', new InstancedBufferAttribute(new Float32Array(displacement), 2));

        // const colorGradient = ResourceLoader.get('view/home/particles-color-gradient');
        this._particlesMat = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColor1: { value: this._colors.primary },
                uColor2: { value: this._colors.secondary },
                uPointSize: { value: PARTICLE_SIZE },
                uInnerGradient: { value: 0.77 },
                uOuterGradient: { value: 0 },
                uOpacity: { value: 0 },
                uTime: { value: 0 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        const mesh = new InstancedMesh(geometry, this._particlesMat, amount);

        let x, y, z;
        const dummy = new Object3D();
        for (let i = 0, len = vertices.length; i < len; i += 3) {
            x = vertices[i + 0];
            y = vertices[i + 1];
            z = vertices[i + 2];
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            mesh.setMatrixAt(i / 3, dummy.matrix);
        }

        this.add(mesh);

        if (this._debug) {
            this._debug.add(this._particlesMat.uniforms.uInnerGradient, 'value', { label: 'inner gradient' });
            this._debug.add(this._particlesMat.uniforms.uOuterGradient, 'value', { label: 'outer gradient' });
            this._debug.add(this._particlesMat.uniforms.uPointSize, 'value', { label: 'point size' });
            this._debug.add(this._particlesMat.uniforms.uOpacity, 'value', { label: 'opacity' });
        }

        return mesh;
    }

    _createCameraAnchorCategory() {
        const targetPosition = new Vector3(0, CATEGORY_Y, 0);
        const targetGeometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
        const targetMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        const targetMesh = new Mesh(targetGeometry, targetMaterial);
        targetMesh.position.copy(targetPosition);
        targetMesh.visible = DEBUG;
        this.add(targetMesh);

        const position = new Vector3(0, 5, 1.7);
        const positionGeometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
        const positionMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
        const positionMesh = new Mesh(positionGeometry, positionMaterial);
        positionMesh.position.copy(position);
        positionMesh.visible = DEBUG;
        this.add(positionMesh);

        const cameraPosition = new Vector3();
        positionMesh.updateMatrixWorld();
        positionMesh.getWorldPosition(cameraPosition);

        const cameraTarget = new Vector3();
        targetMesh.updateMatrixWorld();
        targetMesh.getWorldPosition(cameraTarget);

        const camera = new PerspectiveCamera(50, 1, 0.1, 1);
        this.add(camera);
        camera.position.copy(position);
        camera.lookAt(cameraTarget);
        camera.updateMatrixWorld();

        // camera.rotation.z += 1.5;

        if (DEBUG) {
            const cameraHelper = new CameraHelper(camera);
            this._scene.add(cameraHelper);
        }

        return {
            origin: cameraPosition,
            target: cameraTarget,
            camera,
        };
    }

    _createCameraAnchorsSubcategories() {
        const pointsSubcategories = this._points.subcategories.entries;
        const anchors = {};

        for (const key in pointsSubcategories) {
            const item = pointsSubcategories[key];
            const start = item.start;
            const end = item.end;

            // Target
            // const distance = start.distanceTo(end);
            // const progress = 2 / distance;
            const targetPosition = new Vector3().lerpVectors(start, end, 0);
            const targetGeometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const targetMaterial = new MeshBasicMaterial({ color: 0xff0000 });
            const targetMesh = new Mesh(targetGeometry, targetMaterial);
            targetMesh.position.copy(targetPosition);
            targetMesh.visible = DEBUG;
            this.add(targetMesh);

            // Position
            const position = targetPosition.clone();

            const radius = 4;
            const angle = Math.random() * Math.PI * 2;
            // const angle = Math.PI * 0.4;
            position.x += radius * Math.cos(angle);
            position.z += radius * Math.sin(angle);
            // position.set(0, 15, 0);

            const positionGeometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const positionMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
            const positionMesh = new Mesh(positionGeometry, positionMaterial);
            positionMesh.position.copy(position);
            positionMesh.visible = DEBUG;
            this.add(positionMesh);

            const cameraPosition = new Vector3();
            positionMesh.updateMatrixWorld();
            positionMesh.getWorldPosition(cameraPosition);

            const cameraTarget = new Vector3();
            targetMesh.updateMatrixWorld();
            targetMesh.getWorldPosition(cameraTarget);

            const camera = new PerspectiveCamera(50, 1, 0.1, 1);
            this.add(camera);
            camera.position.copy(position);
            camera.lookAt(cameraTarget);
            camera.updateMatrixWorld();

            if (DEBUG) {
                const cameraHelper = new CameraHelper(camera);
                this._scene.add(cameraHelper);
            }

            anchors[key] = {
                origin: cameraPosition,
                target: cameraTarget,
                camera,
            };
        }

        return anchors;
    }

    _createSubcategoriesLabelAnchors() {
        const subcategories = this._data.subcategories;
        const anchors = [];
        const spread = { x: 0.15, y: 0.3 };
        const amount = subcategories.length;

        subcategories.forEach((subcategory, index) => {
            const anchor = new Object3D();
            const x = index % 2 === 0 ? spread.x : -spread.x;
            const y = CATEGORY_Y + spread.y * index - ((amount - 1) * spread.y) * 0.5;
            anchor.position.set(x, y, 0);
            this.add(anchor);
            anchors.push({
                object: anchor,
                screenSpacePosition: new Vector3(),
            });
        });

        if (DEBUG) {
            anchors.forEach(anchor => {
                const geometry = new BoxGeometry(0.05, 0.05, 0.05);
                const material = new MeshBasicMaterial({ color: 0xff00ff });
                const mesh = new Mesh(geometry, material);
                mesh.position.copy(anchor.object.position);
                this.add(mesh);
            });
        }

        return anchors;
    }

    _getRandomCurve(curves) {
        let sumOfWeight = 0;
        for (let i = 0, len = curves.length; i < len; i++) {
            sumOfWeight += curves[i].weight;
        }
        let random = sumOfWeight * Math.random();

        let item;
        for (let i = 0, len = curves.length; i < len; i++) {
            item = curves[i];
            if (random < item.weight) return item;
            random -= item.weight;
        }
    }

    _destroyEntities() {
        for (const key in this._entities) {
            this._entities[key].destroy();
        }
    }

    /**
     * Update
     */
    update({ time, delta }) {
        if (!this._isActive) return;
        this._updateEntities({ time, delta });
        this._particlesMat.uniforms.uTime.value = time;
        this._updateSubcategoriesLabelAnchorsScreenSpacePosition();
    }

    _updateEntities({ time, delta }) {
        for (const key in this._entities) {
            this._entities[key].update({ time, delta });
        }
    }

    _updateSubcategoriesLabelAnchorsScreenSpacePosition() {
        this._subcategoriesLabelAnchors.forEach(anchor => {
            anchor.screenSpacePosition.setFromMatrixPosition(anchor.object.matrixWorld);
            anchor.screenSpacePosition.project(this._cameraManager.camera);
            anchor.screenSpacePosition.x = (anchor.screenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
            anchor.screenSpacePosition.y = -(anchor.screenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        });
        TreeDataModel.updateSubcategoriesLabelAnchorsPosition(this._subcategoriesLabelAnchors);
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight, dpr }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
    }

    /**
     * Debug
     */
    _createDebug(debug) {
        if (!debug) return;
        const group = debug.addGroup('Branch #' + this._index);
        return group;
    }
}
