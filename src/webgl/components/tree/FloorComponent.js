// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Points, AdditiveBlending, UniformsUtils, UniformsLib } from 'three';
import { ResourceLoader } from '@/vendor/resource-loader';

// Utils
import Debugger from '@/utils/Debugger';
import math from '@/utils/math';
import easings from '@/utils/easings';

// Shaders
import vertexShader from '@/webgl/shaders/floor-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/floor-particles/fragment.glsl';

export default class FloorComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;

        // Setup
        this._plane = this._createPlane();
        this._circle = this._createCircle();

        // Settings
        this.visible = false;
    }

    destroy() {
        super.destroy();
        this._timelineTransitionIn?.kill();
    }

    /**
     * Public
     */
    transitionIn() {
        this._timelineTransitionIn = new gsap.timeline();
        this._timelineTransitionIn.set(this, { visible: true }, 0);
        return this._timelineTransitionIn;
    }

    /**
     * Private
     */
    _createPlane() {
        const size = 200;

        const vertices = [];
        const offsets = [];
        const alpha = [];
        const scale = [];
        for (let i = 0; i < 10000; i ++) {
            const radius = Math.random() * size;
            const angle = Math.random() * Math.PI * 2;

            const x = radius * Math.cos(angle);
            const y = 0;
            const z = radius * Math.sin(angle);
            vertices.push(x, y, z);

            offsets.push(Math.random());
            alpha.push(math.randomArbitrary(0.5, 1));
            scale.push(math.randomArbitrary(0.7, 1));
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('offset', new Float32BufferAttribute(offsets, 1));
        geometry.setAttribute('alpha', new Float32BufferAttribute(alpha, 1));
        geometry.setAttribute('scale', new Float32BufferAttribute(scale, 1));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: UniformsUtils.merge([
                UniformsLib.fog,
                {
                    uColorGradient: { value: ResourceLoader.get('view/home/particles-color-gradient') },
                    uProgress: { value: 0.65 },
                    uPointSize: { value: 150 },
                    uInnerGradient: { value: 0.88 },
                    uOuterGradient: { value: 0.07 },
                },
            ]),
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            fog: true,
        });

        const points = new Points(geometry, material);

        this.add(points);
    }

    _createCircle() {
        const size = 20;

        const vertices = [];
        const offsets = [];
        const alpha = [];
        const scale = [];
        for (let i = 0; i < 3000; i ++) {
            const radius = easings.easeOutCubic(Math.random()) * size;
            const angle = Math.random() * Math.PI * 2;

            const x = radius * Math.cos(angle);
            const y = 0;
            const z = radius * Math.sin(angle);
            vertices.push(x, y, z);

            offsets.push(Math.random());
            alpha.push(math.randomArbitrary(0.5, 1));
            scale.push(math.randomArbitrary(0.7, 1));
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('offset', new Float32BufferAttribute(offsets, 1));
        geometry.setAttribute('alpha', new Float32BufferAttribute(alpha, 1));
        geometry.setAttribute('scale', new Float32BufferAttribute(scale, 1));

        const gradientTexture = ResourceLoader.get('view/home/particles-color-gradient');
        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColorGradient: { value: gradientTexture },
                uProgress: { value: 0.65 },
                uPointSize: { value: 150 },
                uInnerGradient: { value: 0.88 },
                uOuterGradient: { value: 0.07 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });

        const points = new Points(geometry, material);

        this.add(points);
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Tree', { container: this._debugContainer });
        return debug;
    }
}
