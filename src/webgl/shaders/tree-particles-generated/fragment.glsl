// Varyings
varying vec4 vSettings;
varying float vColor;
varying vec2 vUv;

// Uniforms
uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInnerGradient;
uniform float uOuterGradient;
uniform float uOpacity;

float circle(vec2 st, float radius){
    vec2 dist = st - vec2(0.5);
    return 1.0 - smoothstep(radius - (radius * uInnerGradient), radius + (radius * uOuterGradient), dot(dist, dist) * 4.0);
}

void main() {
    // Color
    vec3 color = mix(uColor1, uColor2, vColor);

    // Alpha
    float alpha = circle(vUv, 1.0);
    alpha *= vSettings.z;
    alpha *= uOpacity;

    // Output
    gl_FragColor = vec4(vec3(color * alpha), alpha);
}
