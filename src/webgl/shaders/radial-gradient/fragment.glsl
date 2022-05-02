varying vec2 vUv;

uniform vec3 uColor;
uniform float uAlpha;

#define PI 3.141592653589793

#pragma glslify: random = require(../partials/random.glsl)

float sineInOut(float t) {
    return -0.5 * (cos(PI * t) - 1.0);
}

void main() {
    // Circle
    float alpha = 1.0 - distance(vec2(0.5), vUv) * 2.0;
    alpha = clamp(alpha, 0.0, 1.0);
    alpha = sineInOut(alpha);
    alpha += (random(vUv) - 0.5) * 0.2;

    // Output color
    gl_FragColor = vec4(uColor, alpha * uAlpha);
}
