// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { AdditiveBlending, ArrowHelper, BoxBufferGeometry, BufferGeometry, CameraHelper, CatmullRomCurve3, Euler, Float32BufferAttribute, Line, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Points, ShaderMaterial, Vector3 } from 'three';
import { ResourceLoader } from 'resource-loader';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import math from '@/utils/math';
import device from '@/utils/device';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles-generated/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles-generated/fragment.glsl';

export default class GeneratedBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debug = options.debug;
        this._data = options.data;
        this._scene = options.scene;
        this._colors = options.colors;

        // Setup
        this.hide();
    }

    setup() {
        this._points = this._createPoints();
        // this._debugSkeleton = this._createDebugSkeleton();
        this._curves = this._createCurves();
        this._particles = this._createParticles();
        this._cameraAnchorsSubcategories = this._createCameraAnchorsSubcategories();
        this._cameraAnchorsEntities = this._createCameraAnchorsEntities();
        this._labelAnchorsEntities = this._createLabelAnchorsEntities();
        this._bindHandlers();
        this._setupEventListeners();
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
        return this._cameraAnchorsEntities[name];
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

        const subcategoriesPoints = [];
        const subcategoriesEntries = {};

        const entitiesPoints = [];
        const entitiesEntries = {};

        // Subcategories
        const subcategories = this._data.subcategories;
        const subcategoriesLength = subcategories.length;
        const angleStep = (Math.PI * 2) / subcategoriesLength;
        subcategories.forEach((subcategory, index) => {
            const radius = 8;
            const angle = index * angleStep;

            // Start position
            subcategoriesPoints.push(currentPosition);

            // End position
            const length = subcategory.entities.length * 2;
            const x = currentPosition.x + radius * Math.cos(angle);
            const y = currentPosition.y + length;
            const z = currentPosition.z + radius * Math.sin(angle);
            const endPosition = new Vector3(x, y, z);
            subcategoriesPoints.push(endPosition);

            subcategoriesEntries[subcategory.name] = {
                start: currentPosition,
                end: endPosition,
            };

            const direction = new Vector3();
            direction.subVectors(endPosition, currentPosition);
            direction.normalize();

            const entities = subcategory.entities;
            const entitiesLength = entities.length;
            const points = [currentPosition, endPosition];
            const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0);
            const frenetFrames = curve.computeFrenetFrames(points.length, false);

            entities.forEach((entity, index) => {
                const step = (index + 1) / (entitiesLength + 1);

                const pointProgress = Math.random();
                const startPosition = curve.getPointAt(step);
                entitiesPoints.push(startPosition);

                const radius = 3;
                const angle = Math.random() * Math.PI * 2;

                const fract = pointProgress % 1;
                const indexStart = Math.floor(pointProgress * (frenetFrames.normals.length - 1));
                const indexEnd = Math.ceil(pointProgress * (frenetFrames.normals.length - 1));

                const N = new Vector3().lerpVectors(frenetFrames.normals[indexStart], frenetFrames.normals[indexEnd], fract);
                const B = new Vector3().lerpVectors(frenetFrames.binormals[indexStart], frenetFrames.binormals[indexEnd], fract);

                const sin = Math.sin(angle);
                const cos = -Math.cos(angle);

                const normal = new Vector3();
                normal.x = (cos * N.x + sin * B.x);
                normal.y = (cos * N.y + sin * B.y);
                normal.z = (cos * N.z + sin * B.z);
                normal.normalize();

                const angleOffset = new Vector3().lerpVectors(normal, direction, 0.4);

                const endPosition = new Vector3();
                endPosition.x = startPosition.x + radius * angleOffset.x;
                endPosition.y = startPosition.y + radius * angleOffset.y;
                endPosition.z = startPosition.z + radius * angleOffset.z;
                entitiesPoints.push(endPosition);

                const slug = entity.slug.split('/').slice(-1)[0];

                entitiesEntries[slug] = {
                    start: startPosition,
                    end: endPosition,
                };
            });
        });

        return {
            categories: pointsCategories,
            subcategories: {
                all: subcategoriesPoints,
                entries: subcategoriesEntries,
            },
            entities: {
                all: entitiesPoints,
                entries: entitiesEntries,
            },
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

        {
            const material = new LineBasicMaterial({ color: 0xff0000 });
            const geometry = new BufferGeometry().setFromPoints(this._points.entities.all);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }
    }

    _createCurves() {
        const segments = [...this._points.categories, ...this._points.subcategories.all, ...this._points.entities.all];
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

    _createParticles() {
        const amount = 2000;
        const vertices = [];
        const normals = [];

        for (let i = 0; i < amount; i++) {
            const data = this._getRandomCurve(this._curves);
            const curve = data.curve;

            const pointProgress = Math.random();
            const point = curve.getPointAt(pointProgress);

            const radius = math.randomArbitrary(0, 0.4);
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
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));

        // const colorGradient = ResourceLoader.get('view/home/particles-color-gradient');
        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColor: { value: this._colors.primary },
                // uColorGradient: { value: colorGradient },
                uProgress: { value: 0.65 },
                uPointSize: { value: device.dpr() > 1 ? 100 : 60 },
                uRadius: { value: 0.71 },
                uInnerGradient: { value: 0.88 },
                uOuterGradient: { value: 0.07 },
                uHoverColor: { value: this._hoverColor },
                uShowHover: { value: 0 },
                uOpacity: { value: 0 },
            },
            transparent: true,
            // blending: AdditiveBlending,
            depthWrite: false,
        });
        const mesh = new Points(geometry, material);
        this.add(mesh);

        return mesh;
    }

    _createCameraAnchorsSubcategories() {
        const pointsSubcategories = this._points.subcategories.entries;
        const anchors = {};

        for (const key in pointsSubcategories) {
            const item = pointsSubcategories[key];
            const start = item.start;
            const end = item.end;

            const position = new Vector3().lerpVectors(start, end, 0.2);

            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.visible = false;
            this.add(mesh);

            const origin = position.clone();

            const radius = 4;
            const angle = Math.random() * Math.PI * 2;
            // const angle = Math.PI * 0.4;
            origin.x += radius * Math.cos(angle);
            origin.z += radius * Math.sin(angle);
            origin.set(0, 15, 0);

            const geometryOrigin = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const materialOrigin = new MeshBasicMaterial({ color: 0xff00ff });
            const meshOrigin = new Mesh(geometryOrigin, materialOrigin);
            meshOrigin.position.copy(origin);
            meshOrigin.visible = false;
            this.add(meshOrigin);

            const cameraPosition = new Vector3();
            meshOrigin.updateMatrixWorld();
            meshOrigin.getWorldPosition(cameraPosition);

            const cameraTarget = new Vector3();
            mesh.updateMatrixWorld();
            mesh.getWorldPosition(cameraTarget);

            const camera = new PerspectiveCamera(50, 1, 0.1, 1);
            this.add(camera);
            camera.position.copy(origin);
            camera.lookAt(cameraTarget);
            camera.updateMatrixWorld();

            // const cameraHelper = new CameraHelper(camera);
            // this._scene.add(cameraHelper);

            anchors[key] = {
                origin: cameraPosition,
                target: cameraTarget,
                camera,
            };
        }

        return anchors;
    }

    _createCameraAnchorsEntities() {
        const pointsEntities = this._points.entities.entries;
        const anchors = {};

        for (const key in pointsEntities) {
            const item = pointsEntities[key];
            const start = item.start;
            const end = item.end;

            const curve = new CatmullRomCurve3([start, end], false);
            const frenetFrames = curve.computeFrenetFrames(2, false);
            const normal = frenetFrames.normals[0];
            const tangent = frenetFrames.tangents[0];
            const binormal = frenetFrames.binormals[0];

            const position = new Vector3().lerpVectors(start, end, 0.5);

            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.visible = false;
            this.add(mesh);

            // const arrowHelper = new ArrowHelper(normal, position, 1, 0xff00ff);
            // this.add(arrowHelper);

            const p = position.clone();
            p.add(normal.multiplyScalar(2));

            const origin = position.clone();

            const radius = 3;
            const angle = Math.random() * Math.PI * 2;
            // const angle = Math.PI * 0.4;
            origin.x += radius * Math.cos(angle);
            origin.z += radius * Math.sin(angle);
            // origin.set(0, 15, 0);

            const geometryOrigin = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const materialOrigin = new MeshBasicMaterial({ color: 0xff00ff });
            const meshOrigin = new Mesh(geometryOrigin, materialOrigin);
            meshOrigin.position.copy(p);
            meshOrigin.visible = false;
            this.add(meshOrigin);

            const cameraPosition = new Vector3();
            meshOrigin.updateMatrixWorld();
            meshOrigin.getWorldPosition(cameraPosition);

            const cameraTarget = new Vector3();
            mesh.updateMatrixWorld();
            mesh.getWorldPosition(cameraTarget);

            const container = new Object3D();
            container.position.copy(p);
            this.add(container);

            const camera = new PerspectiveCamera(50, 1, 0.1, 1);
            camera.rotation.y = Math.PI;
            // camera.rotation.z = binormal.z;
            container.add(camera);
            container.lookAt(cameraTarget);

            camera.updateMatrixWorld();

            // setInterval(() => {
            //     camera.rotation.x += 0.01;
            // }, 100);

            // {
            //     const arrowHelper = new ArrowHelper(binormal, cameraPosition, 1, 0x00ffff);
            //     this.add(arrowHelper);
            // }

            // const cameraHelper = new CameraHelper(camera);
            // this._scene.add(cameraHelper);

            // {
            //     const worldDirection = new Vector3();
            //     camera.getWorldDirection(worldDirection);

            //     // worldDirection.x += Math.PI * 0.5;

            //     // const e = new Euler().setFromVector3(worldDirection);

            //     // const arrowHelper = new ArrowHelper(worldDirection, cameraPosition, 1, 0xff0000);
            //     // this._scene.add(arrowHelper);

            //     // const angle = worldDirection.angleTo(binormal);
            //     // camera.rotation.z = angle;
            // }

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
    onWindowResize({ renderWidth, renderHeight }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
    }

    /**
     * Handlers
     */
    _branchAddHandler(data) {
        // console.log(data);
    }
}
