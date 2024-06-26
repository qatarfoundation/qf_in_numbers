// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Object3D, Points, ShaderMaterial, UniformsLib, UniformsUtils } from 'three';

// Utils
import math from '@/utils/math/index';
import TreeDataModel from '@/utils/TreeDataModel';
import Debugger from '@/utils/Debugger';
import dpr from '@/utils/device/dpr';

// Shaders
import vertexShader from '@/webgl/shaders/leaves-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/leaves-particles/fragment.glsl';

// Contants
const PARTICLES_AMOUNT = 300;
const OPACITY = 0.7;

export default class LeavesBasicPartComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._index = options.index;
        this._particleColors = options.particleColors;

        // Setup
        this._isVisible = false;
        this._mesh = this._createMesh();
        this._debug = this._createDebug(options.debug);

        // this.visible = false;

        this._bindHandlers();
        this._setupEventListeners();
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
    }

    /**
     * Private
     */
    show() {
        this._isVisible = true;

        this._timelineHide?.kill();
        this._timelineShow?.kill();

        this._timelineShow = new gsap.timeline();
        // this._timelineShow.set(this, { visible: true }, 0);
        this._timelineShow.to(this._mesh.material.uniforms.uOpacity, { duration: 10, value: OPACITY }, 0);

        return this._timelineShow;
    }

    hide() {
        this._isVisible = false;

        this._timelineHide?.kill();
        this._timelineShow?.kill();

        this._timelineHide = new gsap.timeline();
        this._timelineHide.to(this._mesh.material.uniforms.uOpacity, { duration: 1, value: 0 }, 0);
        // this._timelineHide.set(this, { visible: false }, 0.5);

        return this._timelineHide;
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._branchMouseEnterHandler = this._branchMouseEnterHandler.bind(this);
        this._branchMouseLeaveHandler = this._branchMouseLeaveHandler.bind(this);
    }

    _setupEventListeners() {
        TreeDataModel.addEventListener('branch/mouseEnter', this._branchMouseEnterHandler);
        TreeDataModel.addEventListener('branch/mouseLeave', this._branchMouseLeaveHandler);
    }

    _removeEventListeners() {
        TreeDataModel.removeEventListener('branch/mouseEnter', this._branchMouseEnterHandler);
        TreeDataModel.removeEventListener('branch/mouseLeave', this._branchMouseLeaveHandler);
    }

    _createMesh() {
        const vertices = [];
        const alpha = [];
        const scale = [];
        const hoverColor = [];
        const displacement = [];

        for (let i = 0; i < PARTICLES_AMOUNT; i ++) {
            const radius = 300 * Math.random();

            const u = Math.random();
            const v = Math.random();

            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);

            const r = Math.cbrt(radius);
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = r * sinPhi * cosTheta;
            const y = r * sinPhi * sinTheta;
            const z = r * cosPhi;

            vertices.push(x, y, z);

            alpha.push(math.randomArbitrary(0.1, 1));
            scale.push(math.randomArbitrary(0.7, 1));
            hoverColor.push(Math.random() > 0.5 ? 1 : 0);

            for (let j = 0; j < 4; j++) displacement.push(Math.random() - .5);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('alpha', new Float32BufferAttribute(alpha, 1));
        geometry.setAttribute('scale', new Float32BufferAttribute(scale, 1));
        geometry.setAttribute('hoverColor', new Float32BufferAttribute(hoverColor, 1));
        geometry.setAttribute('displacement', new Float32BufferAttribute(displacement, 4));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: UniformsUtils.merge([
                UniformsLib.fog,
                {
                    uColor: { value: new Color(0x6eceb2) },
                    uProgress: { value: 0.65 },
                    uPointSize: { value: (dpr() > 1 ? 900 : 400) * 1.5 },
                    uInnerGradient: { value: 0.88 },
                    uOuterGradient: { value: 0.07 },
                    uOpacity: { value: 0 },
                    uShowHover: { value: 0 },
                    uHoverColor1: { value: this._particleColors.primary },
                    uHoverColor2: { value: this._particleColors.secondary },
                    uTime: { value: 0 },
                },
            ]),
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            // fog: true,
        });

        const points = new Points(geometry, material);
        this.add(points);

        return points;
    }

    /**
     * Update
     */
    update({ time }) {
        this._mesh.material.uniforms.uTime.value = time;
    }

    /**
     * Handlers
     */
    _branchMouseEnterHandler({ index }) {
        if (!this._isVisible || this._index !== index) return;

        this._branchMouseLeaveTimeline?.kill();
        this._timelineShow?.kill();
        this._branchMouseEnterTimeline = new gsap.timeline();
        this._branchMouseEnterTimeline.to(this._mesh.material.uniforms.uShowHover, { duration: 0.5, value: 1 }, 0);
    }

    _branchMouseLeaveHandler({ index }) {
        if (!this._isVisible || this._index !== index) return;

        this._branchMouseEnterTimeline?.kill();
        this._branchMouseLeaveTimeline = new gsap.timeline();
        this._branchMouseLeaveTimeline.to(this._mesh.material.uniforms.uShowHover, { duration: 0.5, value: 0 }, 0);
    }

    /**
     * Debug
     */
    _createDebug(debugContainer) {
        if (!Debugger) return;

        const debug = debugContainer.addGroup('Leaves part ' + this._index, { container: this._debugContainer });
        debug.add(this, 'position');
        return debug;
    }
}
