// Vendor
import { component } from '@/utils/bidello';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// Shaders
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class FinalPass extends component(ShaderPass) {
    constructor() {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                tDiffuse: { value: null },
            },
        });
    }
}
