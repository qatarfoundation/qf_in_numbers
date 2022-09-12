// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, ShaderMaterial, Float32BufferAttribute, BufferGeometry, Points, AdditiveBlending, Vector2 } from 'three';
import { ResourceLoader } from 'resource-loader';

// Shaders
import vertexShader from '@/webgl/shaders/dust/vertex.glsl';
import fragmentShader from '@/webgl/shaders/dust/fragment.glsl';

// Constants
const PARTICLE_SIZE = 200;

export default class DustComponent extends component(Object3D) {
    init(options = {}) {
        this._mesh = this._createMesh();

        this.position.y = 8;
    }

    destroy() {
        super.destroy();
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
        return this._timelineTransitionIn;
    }

    show() {
        this._timelineShow = new gsap.timeline();
        // this._timelineShow.set(this, { visible: true });
        // this._timelineShow.to(this._mesh.material.uniforms.uOpacity, 2, { value: 1, ease: 'sine.inOut' });
        return this._timelineShow;
    }

    hide() {
        this._timelineHide = new gsap.timeline();
        // this._timelineHide.to(this._mesh.material.uniforms.uOpacity, 2, { value: 0, ease: 'sine.inOut' });
        // this._timelineHide.set(this, { visible: false });
        return this._timelineHide;
    }

    /**
     * Private
     */
    _createMesh() {
        const amount = 500;
        const radius = 10;

        const position = [];
        const displacement = [];
        const colorOffset = [];
        const alpha = [];

        let x, y, z;
        for (let i = 0; i < amount; i++) {
            x = (Math.random() * 2 - 1) * radius;
            y = (Math.random() * 2 - 1) * radius;
            z = (Math.random() * 2 - 1) * radius;
            position.push(x, y, z);

            colorOffset.push(Math.random());
            alpha.push(Math.random());

            for (let j = 0; j < 4; j++) {
                displacement.push(Math.random() - .5);
            }
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('colorOffset', new Float32BufferAttribute(colorOffset, 1));
        geometry.setAttribute('position', new Float32BufferAttribute(position, 3));
        geometry.setAttribute('displacement', new Float32BufferAttribute(displacement, 4));
        geometry.setAttribute('alpha', new Float32BufferAttribute(alpha, 1));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColorGradient: { value: ResourceLoader.get('view/home/particles-color-gradient') },
                uOpacity: { value: 1 },
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

        const mesh = new Points(geometry, material);
        this.add(mesh);

        if (this._debug) {
            this._debug.add(mesh, 'rotation');
            this._debug.add(material.uniforms.uColorGradient, 'value', { label: 'gradient' });
            this._debug.add(material.defines, 'POINT_SIZE', { label: 'point size', stepSize: 1, onUpdate: () => { this._pointsMat.needsUpdate = true; } });
        }

        return mesh;
    }

    /**
     * Update
     */
    update({ time }) {
        if (this._mesh.material !== null) this._mesh.material.uniforms.uTime.value = time;
    }

    /**
     * Resize
     */
    _updateParticleSize(renderHeight, dpr) {
        const scale = renderHeight / 1080;
        this._mesh.material.defines.POINT_SIZE = PARTICLE_SIZE * scale * dpr;
        this._mesh.material.needsUpdate = true;
    }
}
