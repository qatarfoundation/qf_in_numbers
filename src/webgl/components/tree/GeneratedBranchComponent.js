// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { AdditiveBlending, ArrowHelper, BoxBufferGeometry, BufferGeometry, CameraHelper, CatmullRomCurve3, Euler, Float32BufferAttribute, Line, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Points, ShaderMaterial, Vector3 } from 'three';
import { ResourceLoader } from 'resource-loader';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import math from '@/utils/math';
import device from '@/utils/device';

// Components
import GeneratedEntityComponent from '@/webgl/components/tree/GeneratedEntityComponent';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles-generated/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles-generated/fragment.glsl';

// Constants
const PARTICLE_SIZE = 95;

export default class GeneratedBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._index = options.index;
        this._data = options.data;
        this._scene = options.scene;
        this._colors = options.colors;

        // Props
        this._entities = {};
        this._showCameraHelpers = false;

        // Setup
        this._debug = this._createDebug(options.debug);
        this.hide();
    }

    setup() {
        this._points = this._createPoints();
        // this._debugSkeleton = this._createDebugSkeleton();
        this._curves = this._createCurves();
        this._particles = this._createParticles();
        this._cameraAnchorsSubcategories = this._createCameraAnchorsSubcategories();
        this._cameraAnchorsEntities = [];
        // this._labelAnchorsEntities = this._createLabelAnchorsEntities();
        this._bindHandlers();
        this._setupEventListeners();
        this._updateParticleSize(this._renderHeight, this._dpr);
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
    }

    /**
     * Public
     */
    show() {
        gsap.to(this._particles.material.uniforms.uOpacity, { duration: 2, value: 1 });
    }

    hide() {
        if (this._particles) gsap.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: 0 });
    }

    getCameraAnchorSubcategory(name) {
        return this._cameraAnchorsSubcategories[name];
    }

    getCameraAnchorEntity(name) {
        console.log(this._entities[name].cameraAnchor);
        return this._entities[name].cameraAnchor;
    }

    getCameraAnchorSelectEntity(name) {
        // console.log(this._cameraAnchorsEntities[name]);
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._branchAddHandler = this._branchAddHandler.bind(this);
    }

    _setupEventListeners() {
        TreeDataModel.addEventListener('branch/add', this._branchAddHandler);
    }

    _removeEventListeners() {
        TreeDataModel.removeEventListener('branch/add', this._branchAddHandler);
    }

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
            const length = subcategory.entities.length * 1;
            const x = startPosition.x + radius * Math.cos(angle);
            const y = startPosition.y + length;
            const z = startPosition.z + radius * Math.sin(angle);
            const endPosition = new Vector3(x, y, z);
            subcategoriesPoints.push(endPosition.clone());

            subcategoriesEntries[subcategory.name] = {
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
                    slug,
                    scene: this._scene,
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
        const amount = 4000;
        const vertices = [];
        const normals = [];
        const settings = [];
        const colors = [];

        for (let i = 0; i < amount; i++) {
            const data = this._getRandomCurve(this._curves);
            const curve = data.curve;

            const pointProgress = Math.random();
            const point = curve.getPointAt(pointProgress);

            const radius = math.randomArbitrary(0, 0.1);
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
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geometry.setAttribute('settings', new Float32BufferAttribute(settings, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 1));

        // const colorGradient = ResourceLoader.get('view/home/particles-color-gradient');
        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColor1: { value: this._colors.primary },
                uColor2: { value: this._colors.secondary },
                uPointSize: { value: PARTICLE_SIZE },
                uInnerGradient: { value: 0.77 },
                uOuterGradient: { value: 0 },
                uOpacity: { value: 0 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        const mesh = new Points(geometry, material);
        this.add(mesh);

        if (this._debug) {
            this._debug.add(material.uniforms.uInnerGradient, 'value', { label: 'inner gradient' });
            this._debug.add(material.uniforms.uOuterGradient, 'value', { label: 'outer gradient' });
            this._debug.add(material.uniforms.uPointSize, 'value', { label: 'point size', stepSize: 1 });
        }

        return mesh;
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
            targetMesh.visible = this._showCameraHelpers;
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
            positionMesh.visible = this._showCameraHelpers;
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

            if (this._showCameraHelpers) {
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

    _createLabelAnchorsEntities() {
        const pointsEntities = this._points.entities.entries;
        const anchors = {};

        for (const key in pointsEntities) {
            const item = pointsEntities[key];
            const start = item.start;
            const end = item.end;

            const position = new Vector3().lerpVectors(start, end, 0.7);

            const geometry = new BoxBufferGeometry(0.05, 0.05, 0.05);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            mesh.visible = false;
            mesh.position.copy(position);
            this.add(mesh);
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

    /**
     * Update
     */
    update() {
        this._updateLabelAnchorsEntitesScreenSpacePosition();
    }

    _updateLabelAnchorScreenSpacePosition() {
        // this._labelAnchorScreenSpacePosition.setFromMatrixPosition(this._labelAnchor.matrixWorld);
        // this._labelAnchorScreenSpacePosition.project(this._cameraManager.camera);
        // this._labelAnchorScreenSpacePosition.x = (this._labelAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        // this._labelAnchorScreenSpacePosition.y = -(this._labelAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        // TreeDataModel.updateCategoryLabelPosition(this._index, this._labelAnchorScreenSpacePosition);
    }

    /**
     * Resize
     */

    onWindowResize({ renderWidth, renderHeight, dpr }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;

        this._renderHeight = renderHeight;
        this._dpr = dpr;
        this._updateParticleSize(renderHeight, dpr);
    }

    _updateParticleSize(renderHeight, dpr) {
        if (!this._particles) return;
        const scale = renderHeight / 1080;
        this._particles.material.uniforms.uPointSize.value = PARTICLE_SIZE * scale * dpr;
    }

    /**
     * Handlers
     */
    _branchAddHandler(data) {
        // console.log(data);
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
