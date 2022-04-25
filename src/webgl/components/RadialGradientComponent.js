// Vendor
import { component } from '@/utils/bidello';
import { gsap } from 'gsap';
import { Object3D, Mesh, PlaneBufferGeometry, Color, ShaderMaterial } from 'three';

// Shaders
import vertexShader from '@/webgl/shaders/radial-gradient/vertex.glsl';
import fragmentShader from '@/webgl/shaders/radial-gradient/fragment.glsl';

export default class RadialGradientComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._color = options.color;
        this._alpha = options.alpha;
        this._size = options.size;
        this._hidden = options.hidden || false;

        // Props
        this._globalAlpha = this._hidden ? 0 : 1;

        // Setup
        this._mesh = this._createMesh();
    }

    destroy() {
        super.destroy();
        this._mesh.geometry.dispose();
        this._mesh.material.dispose();
        this.remove(this._mesh);
    }

    /**
     * Getters & Setters
     */
    get color() {
        return this._color;
    }

    set color(color) {
        this._color = color;
        this._mesh.material.uniforms.uColor.value = new Color(this._color);
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(alpha) {
        this._alpha = alpha;
        this._mesh.material.uniforms.uAlpha.value = this._alpha * this._globalAlpha;
    }

    get size() {
        return this._size;
    }

    /**
     * Public
     */
    show() {
        return gsap.to(this, 3, {
            _globalAlpha: 1,
            ease: 'sine.inOut',
            onUpdate: () => {
                this._mesh.material.uniforms.uAlpha.value = this._alpha * this._globalAlpha;
            },
        });
    }

    hide() {
        return gsap.to(this, 3, {
            _globalAlpha: 0,
            ease: 'sine.inOut',
            onUpdate: () => {
                this._mesh.material.uniforms.uAlpha.value = this._alpha * this._globalAlpha;
            },
        });
    }

    /**
     * Private
     */
    _createMesh() {
        const geometry = new PlaneBufferGeometry(this._size, this._size);
        const material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { value: new Color(this._color) },
                uAlpha: { value: this._alpha * this._globalAlpha },
            },
            transparent: true,
            depthTest: false,
        });

        const mesh = new Mesh(geometry, material);
        mesh.userData.renderBloom = false;
        this.add(mesh);
        return mesh;
    }
}
