// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, CatmullRomCurve3, BoxBufferGeometry, Vector3, ShaderMaterial, Float32BufferAttribute, BufferGeometry, Points, AdditiveBlending, Color, TubeGeometry, MeshBasicMaterial, Mesh, Vector2, Light } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ResourceLoader } from '@/vendor/resource-loader';

// Utils
import math from '@/utils/math';
import TreeDataModel from '@/utils/TreeDataModel';
import TreeParser from '@/webgl/utils/TreeParser';
import Breakpoints from '@/utils/Breakpoints';
import BranchHover from '@/utils/BranchHover';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles/fragment.glsl';

// Constants
const PARTICLE_SIZE = 200;

export default class TreeBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._index = options.index;
        this._config = options.config;
        this._particleColors = options.particleColors;
        this._backgroundColor = options.backgroundColor;
        this._cameraManager = options.cameraManager;
        this._anchorPosition = options.anchorPosition;
        this._subcategoriesAnchorPosition = options.subcategoriesAnchorPosition;
        this._slug = options.slug;
        this._parent = options.parent;

        // Props
        this._labelAnchorScreenSpacePosition = new Vector3();
        this._subcategoriesAnchorScreenSpacePosition = new Vector3();

        // Setup
        this._pointsMat = null;
        this._debug = this._createDebug(options.debug);
        this._curves = this._createCurves();
        this._mesh = this._createMesh();
        this._hitArea = this._createHitArea();
        this._labelAnchor = this._createLabelAnchor();
        this._subcategoriesAnchor = this._createSubcategoriesAnchor();
        this._mouseHover = gsap.quickTo(this._mesh.material.uniforms.uShowHover, 'value', { duration: 1 });

        BranchHover[this._slug].addEventListener('mouseEnter', (id) => {
            if (id === this._slug) {
                this._mouseEnter();
            }
        });

        BranchHover[this._slug].addEventListener('mouseLeave', (id) => {
            if (id === this._slug) {
                this._mouseLeave();
            }
        });
    }

    destroy() {
        super.destroy();
        this._timelineTransitionIn?.kill();
        this._timelineShow?.kill();
        this._timelineHide?.kill();
        this._storeUnsubscribe();
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

    get slug() {
        return this._slug;
    }

    get backgroundColor() {
        return this._backgroundColor;
    }

    /**
     * Public
     */
    transitionIn() {
        this._timelineTransitionIn = new gsap.timeline();
        this._timelineTransitionIn.set(this, { visible: true });
        // this._timelineTransitionIn.fromTo(this._mesh.material.uniforms.uProgress, 10, { value: 0 }, { value: 0.65, repeat: 0, repeatDelay: 2, ease: 'sine.inOut' });
        return this._timelineTransitionIn;
    }

    show() {
        this._timelineShow = new gsap.timeline();
        this._timelineShow.set(this, { visible: true });
        this._timelineShow.to(this._mesh.material.uniforms.uOpacity, 2, { value: 1, ease: 'sine.inOut' });
        return this._timelineShow;
    }

    hide() {
        this._timelineHide = new gsap.timeline();
        this._timelineHide.to(this._mesh.material.uniforms.uOpacity, 2, { value: 0, ease: 'sine.inOut' });
        this._timelineHide.set(this, { visible: false });
        return this._timelineHide;
    }

    quickHide() {
        this._timelineQuickHide = new gsap.timeline();
        this._timelineQuickHide.to(this._mesh.material.uniforms.uOpacity, 0.5, { value: 0, ease: 'sine.inOut' });
        this._timelineQuickHide.set(this, { visible: false });
        return this._timelineQuickHide;
    }

    fadeIn() {
        gsap.to(this._mesh.material.uniforms.uOpacity, { duration: 0.5, value: 1 });
    }

    fadeOut() {
        gsap.to(this._mesh.material.uniforms.uOpacity, { duration: 0.5, value: 0.4 });
    }

    enable() {
        gsap.to(this._mesh.material.uniforms.uDisabled, { duration: 0.5, value: 1 });
    }

    disable() {
        gsap.to(this._mesh.material.uniforms.uDisabled, { duration: 0.5, value: 0.2 });
    }

    mouseEnter() {
        BranchHover[this._slug].mouseEnter(this._slug);
    }

    mouseLeave() {
        BranchHover[this._slug].mouseLeave(this._slug);
    }

    /**
     * Private
     */
    _createCurves() {
        const gltf = ResourceLoader.get('view/home/tree');
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
            const weight = curve.points.length;

            curves.push({
                startOrder,
                endOrder,
                curve,
                frenetFrames,
                weight,
            });
        }

        return curves;
    }

    _createMesh() {
        const amount = 5000;
        // const amount = 10000;
        const vertices = [];
        const normals = [];
        const progress = [];
        const settings = [];
        const hoverColor = [];
        const displacement = [];

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
            settings.push(math.randomArbitrary(0.5, 1)); // Scale
            settings.push(math.randomArbitrary(0.5, 1)); // Alpha

            hoverColor.push(Math.random() > 0.5 ? 1.0 : 0.0);

            for (let j = 0; j < 4; j++) displacement.push(Math.random() - .5);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geometry.setAttribute('settings', new Float32BufferAttribute(settings, 4));
        geometry.setAttribute('hoverColor', new Float32BufferAttribute(hoverColor, 1));
        geometry.setAttribute('displacement', new Float32BufferAttribute(displacement, 4));

        const colorGradient = ResourceLoader.get('view/home/particles-color-gradient');

        this._pointsMat = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColorGradient: { value: colorGradient },
                uRadius: { value: 0.55 },
                uInnerGradient: { value: 1.25 },
                uOuterGradient: { value: 0.15 },
                uHoverColor1: { value: this._particleColors.primary },
                uHoverColor2: { value: this._particleColors.secondary },
                uShowHover: { value: 0 },
                uOpacity: { value: 1 },
                uDisabled: { value: 1 },
                uTime: { value: 0 },
                uParticle: { value: ResourceLoader.get('view/home/particle') },
                uResolution: { value: new Vector2() },
            },
            defines: {
                POINT_SIZE: PARTICLE_SIZE,
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });

        const mesh = new Points(geometry, this._pointsMat);
        this.add(mesh);

        if (this._debug) {
            this._debug.add(mesh, 'rotation');
            this._debug.add(this._pointsMat.uniforms.uColorGradient, 'value', { label: 'gradient' });
            this._debug.add(this._pointsMat.uniforms.uInnerGradient, 'value', { label: 'inner gradient' });
            this._debug.add(this._pointsMat.uniforms.uOuterGradient, 'value', { label: 'outer gradient' });
            this._debug.add(this._pointsMat.uniforms.uRadius, 'value', { label: 'radius' });
            this._debug.add(this._pointsMat.defines, 'POINT_SIZE', { label: 'point size', stepSize: 1, onUpdate: () => { this._pointsMat.needsUpdate = true; } });
        }

        return mesh;
    }

    _createHitArea() {
        const geometries = [];
        this._curves.forEach((item) => {
            const tubularSegments = Math.max(1, Math.round(item.curve.points.length * 0.5));
            const geometry = new TubeGeometry(item.curve, tubularSegments, 1.6, 3, false);
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
        const geometry = new BoxBufferGeometry(0.2, 0.2, 0.2);
        const material = new MeshBasicMaterial({ color: 0x0000ff });
        const mesh = new Mesh(geometry, material);
        mesh.visible = false;
        mesh.position.copy(this._anchorPosition);
        this.add(mesh);
        return mesh;
    }

    _createSubcategoriesAnchor() {
        const geometry = new BoxBufferGeometry(0.2, 0.2, 0.2);
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new Mesh(geometry, material);
        mesh.visible = false;
        mesh.position.copy(this._subcategoriesAnchorPosition);
        if (Breakpoints.active('small')) mesh.position.y -= 2;
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

    _mouseEnter() {
        this._mouseHover(1);
        TreeDataModel.dispatchEvent('branch/mouseEnter', { index: this._index });

        gsap.killTweensOf(this.$composer.passes.backgroundGradient.color);
        gsap.killTweensOf(this.$composer.passes.backgroundGradient);

        const { r, g, b } = this._backgroundColor;
        gsap.to(this.$composer.passes.backgroundGradient.color, { duration: 1, r, g, b, ease: 'sine.out' });
        gsap.to(this.$composer.passes.backgroundGradient, { duration: 1, gradientType: 1, ease: 'sine.out' });

        this._parent.fadeOutBranches(this);
    }

    _mouseLeave() {
        this._mouseHover(0);

        this._parent.fadeInBranches();

        TreeDataModel.dispatchEvent('branch/mouseLeave', { index: this._index });

        gsap.killTweensOf(this.$composer.passes.backgroundGradient.color);
        gsap.killTweensOf(this.$composer.passes.backgroundGradient);

        gsap.to(this.$composer.passes.backgroundGradient.color, { duration: 1.5, r: 0.08235294117647059, g: 0.29411764705882354, b: 0.2823529411764706, ease: 'sine.inOut' });
        gsap.to(this.$composer.passes.backgroundGradient, { duration: 1, gradientType: 0, ease: 'sine.out' });
    }

    /**
     * Update
     */
    update({ time, delta }) {
        this._updateLabelAnchorScreenSpacePosition();
        this._updateSubcategoriesAnchorScreenSpacePosition();
        if (this._pointsMat !== null) this._pointsMat.uniforms.uTime.value = time;
    }

    _updateLabelAnchorScreenSpacePosition() {
        this._labelAnchorScreenSpacePosition.setFromMatrixPosition(this._labelAnchor.matrixWorld);
        this._labelAnchorScreenSpacePosition.project(this._cameraManager.camera);
        this._labelAnchorScreenSpacePosition.x = (this._labelAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._labelAnchorScreenSpacePosition.y = -(this._labelAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateCategoryLabelPosition(this._index, this._labelAnchorScreenSpacePosition);
    }

    _updateSubcategoriesAnchorScreenSpacePosition() {
        this._subcategoriesAnchorScreenSpacePosition.setFromMatrixPosition(this._subcategoriesAnchor.matrixWorld);
        this._subcategoriesAnchorScreenSpacePosition.project(this._cameraManager.camera);
        this._subcategoriesAnchorScreenSpacePosition.x = (this._subcategoriesAnchorScreenSpacePosition.x * this._halfRenderWidth) + this._halfRenderWidth;
        this._subcategoriesAnchorScreenSpacePosition.y = -(this._subcategoriesAnchorScreenSpacePosition.y * this._halfRenderHeight) + this._halfRenderHeight;
        TreeDataModel.updateSubcategoriesAnchorPosition(this._index, this._subcategoriesAnchorScreenSpacePosition);
    }

    /**
     * Resize
     */
    onWindowResize({ renderWidth, renderHeight, dpr }) {
        this._halfRenderWidth = renderWidth * 0.5;
        this._halfRenderHeight = renderHeight * 0.5;
        this._updateParticleSize(renderHeight, dpr);
        this._mesh.material.uniforms.uResolution.value.set(renderWidth, renderHeight);
    }

    _updateParticleSize(renderHeight, dpr) {
        const scale = renderHeight / 1080;
        this._mesh.material.defines.POINT_SIZE = PARTICLE_SIZE * scale * dpr;
        this._mesh.material.needsUpdate = true;
    }

    /**
     * Debug
     */
    _createDebug(debug) {
        if (!debug) return;
        const group = debug.addGroup('Branch #' + this._index);
        group.add(this, 'position');
        group.add(this, 'rotation');
        return group;
    }
}
