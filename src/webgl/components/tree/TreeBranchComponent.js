// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, CatmullRomCurve3, BoxBufferGeometry, Vector3, ShaderMaterial, Float32BufferAttribute, BufferGeometry, Points, AdditiveBlending, Color, TubeGeometry, MeshBasicMaterial, Mesh } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ResourceLoader } from 'resource-loader';

// Utils
import math from '@/utils/math';
import TreeDataModel from '@/utils/TreeDataModel';
import TreeParser from '@/webgl/utils/TreeParser';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles/fragment.glsl';

export default class TreeBranchComponent extends component(Object3D) {
    init(options = {}) {
        // options
        this._hoverColor = options.hoverColor;
        this._index = options.index;
        this._cameraManager = options.cameraManager;

        // Setup
        this._screenSpacePosition = new Vector3();
        this._debug = this._createDebug(options.debug);
        this._curves = this._createCurves();
        this._mesh = this._createMesh();
        this._hitArea = this._createHitArea();
        this._labelAnchor = this._createLabelAnchor();
        this._mouseHover = gsap.quickTo(this._mesh.material.uniforms.uShowHover, 'value', { duration: 1 });

        // this.show();
    }

    destroy() {
        super.destroy();
        this._timelineShow?.kill();
    }

    /**
     * Getters & Setters
     */
    get mesh() {
        return this._mesh;
    }

    get hitArea() {
        return this._hitArea;
    }

    /**
     * Public
     */
    show() {
        this._timelineShow = new gsap.timeline({ delay: 2.5 });
        this._timelineShow.fromTo(this._mesh.material.uniforms.uProgress, 7, { value: 0 }, { value: 0.6, repeat: 0, repeatDelay: 2, ease: 'sine.inOut' });
        return this._timelineShow;
    }

    mouseEnter() {
        this._mouseHover(1);
    }

    mouseLeave() {
        this._mouseHover(0);
    }

    /**
     * Private
     */
    _createCurves() {
        const gltf = ResourceLoader.get('view/tree/tree');
        const model = gltf.scene.getObjectByName('Plane').clone();
        // this.add(model);
        const treeParse = new TreeParser({ model });
        const branches = treeParse.branches;

        const curves = [];
        for (let i = 0, len = branches.length; i < len; i++) {
            const branch = branches[i];

            const startOrder = branch[0].order;
            const endOrder = branch[branch.length - 1].order;

            const points = [];
            for (let i = 0, len = branch.length; i < len; i++) {
                const item = branch[i];
                points.push(item.vertex);
            }

            const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0);
            const frenetFrames = curve.computeFrenetFrames(points.length, false);
            const color = new Color(Math.random(), Math.random(), Math.random());
            const weight = curve.points.length;

            curves.push({
                startOrder,
                endOrder,
                curve,
                frenetFrames,
                color,
                weight,
            });
        }

        return curves;
    }

    _createMesh() {
        const amount = 50000;
        const vertices = [];
        const normals = [];
        const progress = [];
        const settings = [];
        const colors = [];

        for (let i = 0; i < amount; i++) {
            const data = this._getRandomCurve(this._curves);
            const curve = data.curve;

            const startOrder = data.startOrder;
            const endOrder = data.endOrder;

            const pointProgress = Math.random();
            const point = curve.getPointAt(pointProgress);

            const radius = 0;
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

            const orderProgress = math.lerp(startOrder, endOrder, pointProgress);
            progress.push(orderProgress / 18);

            settings.push(Math.random()); // Offset
            settings.push(math.randomArbitrary(0.2, 1)); // Radius
            settings.push(math.randomArbitrary(0.7, 1)); // Scale
            settings.push(math.randomArbitrary(0.5, 1)); // Alpha

            colors.push(data.color.r, data.color.g, data.color.b);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geometry.setAttribute('progress', new Float32BufferAttribute(progress, 1));
        geometry.setAttribute('settings', new Float32BufferAttribute(settings, 4));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        const colorGradient = ResourceLoader.get('view/tree/particles-color-gradient');
        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColorGradient: { value: colorGradient },
                uProgress: { value: 0.65 },
                uPointSize: { value: 47 },
                uRadius: { value: 0.71 },
                uInnerGradient: { value: 0.88 },
                uOuterGradient: { value: 0.07 },
                uHoverColor: { value: this._hoverColor },
                uShowHover: { value: 0 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });
        const mesh = new Points(geometry, material);
        this.add(mesh);

        if (this._debug) {
            this._debug.add(mesh, 'rotation');
            this._debug.add(material.uniforms.uProgress, 'value', { label: 'progress' });
            this._debug.add(material.uniforms.uColorGradient, 'value', { label: 'gradient' });
            this._debug.add(material.uniforms.uInnerGradient, 'value', { label: 'inner gradient' });
            this._debug.add(material.uniforms.uOuterGradient, 'value', { label: 'outer gradient' });
            this._debug.add(material.uniforms.uRadius, 'value', { label: 'radius' });
            this._debug.add(material.uniforms.uPointSize, 'value', { label: 'point size', stepSize: 1 });
            this._debug.add(material.uniforms.uPointSize, 'value', { label: 'point size', stepSize: 1 });
        }

        return mesh;
    }

    _createHitArea() {
        const geometries = [];
        this._curves.forEach((item) => {
            const tubularSegments = Math.max(1, Math.round(item.curve.points.length * 0.5));
            const geometry = new TubeGeometry(item.curve, tubularSegments, 1, 3, false);
            geometries .push(geometry);
        });
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
        const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const mesh = new Mesh(mergedGeometry, material);
        mesh.visible = false;
        this.add(mesh);
        return mesh;
    }

    _createLabelAnchor() {
        const position = new Vector3(0, 9, 0);
        const geometry = new BoxBufferGeometry(0.2, 0.2, 0.2);
        const material = new MeshBasicMaterial({ color: 0x0000ff });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(position);
        this.add(mesh);
        return mesh;
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
        this._updateLabelScreenSpacePosition();
    }

    _updateLabelScreenSpacePosition() {
        this._screenSpacePosition.setFromMatrixPosition(this._labelAnchor.matrixWorld);
        this._screenSpacePosition.project(this._cameraManager.camera);
        this._screenSpacePosition.x = (this._screenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._screenSpacePosition.y = -(this._screenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateCategoryLabelPosition(this._index, this._screenSpacePosition);
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
    }

    /**
     * Debug
     */
    _createDebug(debug) {
        if (!debug) return;
        const group = debug.addGroup('Branch');
        group.add(this, 'position');
        group.add(this, 'rotation');
        return group;
    }
}
