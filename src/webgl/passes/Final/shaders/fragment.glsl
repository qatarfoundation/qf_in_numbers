varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uVignetteDirection;
uniform float uVignetteOffset;
uniform float uVignetteDarkness;

#pragma glslify: vignette = require(../../../../vendor/shader-partials/effects/vignette)

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    vec4 vign = vignette(color, vUv, uVignetteOffset, uVignetteDarkness);
    float vignetteDirection = uVignetteDirection > 0.0 ? 1.0 - vUv.x : vUv.x;
    vec4 outputColor = mix(color, vign, vignetteDirection);
    gl_FragColor = outputColor;
}
