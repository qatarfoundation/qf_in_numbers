// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, BufferGeometry, Float32BufferAttribute, ShaderMaterial, UniformsUtils, UniformsLib, Color, AdditiveBlending, Points, Vector3 } from 'three';

// Utils
import Debugger from '@/utils/Debugger';
import math from '@/utils/math';

// Shaders
import vertexShader from '@/webgl/shaders/leaves-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/leaves-particles/fragment.glsl';

// Constants
const SPAWN_POSITIONS = [
    new Vector3(13.73, 16.72, -0.44),
    new Vector3(0.74, 20.54, 0.48),
    new Vector3(-14.31, 16, 2.35),
];

export default class LeavesBasicComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;

        // Setup
        this._debug = this._createDebug();
        this._mesh = this._createMesh();

        this.show();
    }

    destroy() {
        super.destroy();
        this._timelineShow?.kill();
    }

    /**
     * Public
     */
    show() {
        this._timelineShow = new gsap.timeline({ delay: 5 });
        this._timelineShow.to(this._mesh.material.uniforms.uOpacity, 7, { value: 0.5, ease: 'sine.inOut' }, 0);
        return this._timelineShow;
    }

    /**
     * Private
     */
    _createMesh() {
        const vertices = [];
        const alpha = [];
        const scale = [];

        SPAWN_POSITIONS.forEach((position) => {
            for (let i = 0; i < 1000; i ++) {
                const radius = 1100 * Math.random();

                const u = Math.random();
                const v = Math.random();

                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);

                const r = Math.cbrt(radius);
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = position.x + r * sinPhi * cosTheta;
                const y = position.y + r * sinPhi * sinTheta;
                const z = position.z + r * cosPhi;

                vertices.push(x, y, z);

                alpha.push(math.randomArbitrary(0.5, 1));
                scale.push(math.randomArbitrary(0.7, 1));
            }
        });

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('alpha', new Float32BufferAttribute(alpha, 1));
        geometry.setAttribute('scale', new Float32BufferAttribute(scale, 1));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: UniformsUtils.merge([
                UniformsLib.fog,
                {
                    uColor: { value: new Color(0x6eceb2) },
                    uProgress: { value: 0.65 },
                    uPointSize: { value: 350 },
                    uInnerGradient: { value: 0.88 },
                    uOuterGradient: { value: 0.07 },
                    uOpacity: { value: 0 },
                },
            ]),
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            fog: true,
        });

        const points = new Points(geometry, material);
        this.add(points);

        if (this._debug) {
            this._debug.add(points, 'position');
        }

        return points;
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Leaves', { container: this._debugContainer });
        return debug;
    }
}
