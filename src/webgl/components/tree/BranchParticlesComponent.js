// Vendor
import { gsap } from 'gsap';
import { AdditiveBlending, Box3Helper, InstancedBufferAttribute, InstancedMesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3 } from 'three';
import { component } from '@/utils/bidello';

// Utils
import math from '@/utils/math';
import Breakpoints from '@/utils/Breakpoints';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles-generated/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles-generated/fragment.glsl';

const DEBUG = false;

export default class BranchParticlesComponent extends component(Object3D) {
    init(options) {
        // Options
        this._colors = options.colors;
        this._size = options.size || 1;
        this._amount = options.amount || 10;
        this._length = options.length || 1;
        this._progress = options.progress !== undefined ? options.progress :  1;

        // Props
        this._globalOpacity = 1;

        // Setup
        this._particles = this._createParticles();
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value;
    }

    /**
     * Public
     */
    show() {
        gsap.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: this._globalOpacity, ease: 'sine.inOut' });
    }

    hide() {
        gsap.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: 0, ease: 'sine.inOut' });
    }

    /**
     * Private
     */
    _createParticles() {
        const vertices = [];
        const settings = [];
        const colors = [];
        const displacement = [];
        const progress = [];
        const maxRadius = 0.7;

        for (let i = 0; i < this._amount; i ++) {
            const radius = Math.random() * maxRadius;
            const angle = Math.PI * 2 * Math.random();
            const x = radius * Math.cos(angle);
            const y = Math.random() * this._length;
            const z = radius * Math.sin(angle);
            vertices.push(x, y, z);

            settings.push(math.randomArbitrary(0.2, 1)); // Radius
            settings.push(math.randomArbitrary(0.5, 1)); // Scale
            settings.push(math.randomArbitrary(0.5, 1)); // Alpha

            colors.push(Math.random() > 0.5 ? 1 : 0);

            displacement.push(Math.random());
            displacement.push(Math.random());

            progress.push(y / this._length);
        }

        const geometry = new PlaneGeometry(0.2, 0.2);
        geometry.setAttribute('settings', new InstancedBufferAttribute(new Float32Array(settings), 3));
        geometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 1));
        geometry.setAttribute('displacement', new InstancedBufferAttribute(new Float32Array(displacement), 2));
        geometry.setAttribute('progress', new InstancedBufferAttribute(new Float32Array(progress), 1));

        geometry.computeBoundingBox();
        geometry.boundingBox.set(new Vector3(-maxRadius, 0, -maxRadius), new Vector3(maxRadius, this._length, maxRadius));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColor1: { value: this._colors.primary },
                uColor2: { value: this._colors.secondary },
                uPointSize: { value: this._size },
                uInnerGradient: { value: 0.77 },
                uOuterGradient: { value: 0 },
                uOpacity: { value: 0 },
                uTime: { value: 0 },
                uProgress: { value: this._progress },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        const mesh = new InstancedMesh(geometry, material, this._amount);
        // mesh.frustumCulled = true;

        if (DEBUG) {
            const box = new Box3Helper(geometry.boundingBox, 0xffff00);
            this.add(box);
        }

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

        return mesh;
    }

    /**
     * Update
     */
    update({ time }) {
        this._particles.material.uniforms.uTime.value = time;
        this._particles.material.uniforms.uProgress.value = this._progress;
    }

    /**
     * Resize
     */
    onWindowResize() {
        this._globalOpacity = Breakpoints.active('small') ? 0.3 : 1;
    }
}
