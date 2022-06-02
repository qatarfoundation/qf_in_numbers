// Vendor
import { component } from '@/utils/bidello';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { Color, Vector2 } from 'three';

// Shaders
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class BackgroundGradientPass extends component(ShaderPass) {
    constructor(options) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { value: new Color(0x154B48) },
                uAlpha: { value:0.32 }, // 0.32
                uRadialScale: { value: new Vector2(0.57, 0.58) },
                uLinearRotation: { value: 0.49 },
                uLinearPosition: { value: new Vector2(0.56, 0.24) },
                uGradientType: { value: 0 },
            },
        });

        // Setup
        this._debug = this._createDebug(options.debug);

        // Settings
        this.material.depthTest = false;
        this.material.depthWrite = false;
    }

    /**
     * Public
     */
    get color() {
        return this.uniforms.uColor.value;
    }

    set color(value) {
        this.uniforms.uColor.value = value;
    }

    get gradientType() {
        return this.uniforms.uGradientType.value;
    }

    set gradientType(value) {
        this.uniforms.uGradientType.value = value;
    }

    /**
     * Private
     */
    _createDebug(debugContainer) {
        if (!debugContainer) return;

        const debug = debugContainer.addGroup('Background gradient');
        debug.add(this, 'enabled');
        debug.add(this.uniforms, 'uColor');
        debug.add(this.uniforms, 'uRadialScale');
        debug.add(this.uniforms.uAlpha, 'value', { label: 'alpha' });
        debug.add(this.uniforms.uLinearRotation, 'value', { label: 'linear rotation' });
        debug.add(this.uniforms, 'uLinearPosition');
    }
}
