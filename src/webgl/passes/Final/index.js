// Vendor
import { component } from '@/utils/bidello';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// Shaders
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class FinalPass extends component(ShaderPass) {
    constructor({ vignette }) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                tDiffuse: { value: null },

                // Vignette
                uVignetteOffset: { value: vignette.offset },
                uVignetteDarkness: { value: vignette.darkness },
                uVignetteDirection: { value: vignette.direction },
            },
        });
    }

    /**
     * Vignette
     */
    get vignetteOffset() {
        return this.uniforms.uVignetteOffset.value;
    }

    set vignetteOffset(value) {
        this.uniforms.uVignetteOffset.value = value;
    }

    get vignetteDarkness() {
        return this.uniforms.uVignetteDarkness.value;
    }

    set vignetteDarkness(value) {
        this.uniforms.uVignetteDarkness.value = value;
    }
}
