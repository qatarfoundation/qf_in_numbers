// Constants
#define PI 3.141592653589793

// Varyings
varying vec2 vUv;

// Uniforms
uniform vec3 uColor;
uniform float uAlpha;
uniform vec2 uRadialScale;
uniform float uLinearRotation;
uniform vec2 uLinearPosition;
uniform float uGradientType;

// Includes
#pragma glslify: rotateUV = require(../../../../vendor/shader-partials/math/rotateUV)
#pragma glslify: mapRange = require(../../../../vendor/shader-partials/math/mapRange)

// https://www.shadertoy.com/view/4djSRW
float random(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float sineInOut(float t) {
    return -0.5 * (cos(PI * t) - 1.0);
}

vec3 linearGradient(vec2 uv, vec3 color, float rotation, vec2 position) {
    uv = rotateUV(uv, uLinearRotation);
    uv += uLinearPosition;
    float alpha = mapRange(uv.x, 0.0, 1.0, 0.5, 1.0);
    return color * alpha;
}

vec3 radialGradient(vec2 uv, vec3 color, vec2 scale) {
    uv *= uRadialScale;
    vec2 center = vec2(0.5) * scale;
    float alpha = 1.0 - distance(center, uv) * 2.0;
    alpha = clamp(alpha, 0.0, 1.0);
    alpha = sineInOut(alpha);
    return color * alpha;
}

void main() {
    // Color
    vec3 colorRadial = radialGradient(vUv, uColor, uRadialScale);
    vec3 colorLinear = linearGradient(vUv, uColor, uLinearRotation, uLinearPosition);
    vec3 gradientColor = mix(colorRadial, colorLinear, uGradientType);

    // Output color
    float alpha = uAlpha;
    alpha += (random(vUv) - 0.5) * 0.05;
    vec3 color = gradientColor * alpha;
    color += gradientColor * 0.06;
    gl_FragColor = vec4(color, 1.0);
}
