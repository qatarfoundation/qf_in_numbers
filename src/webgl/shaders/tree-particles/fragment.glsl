// Varyings
varying float vProgress;
varying vec4 vSettings;
varying vec3 vColor;

// Uniforms
uniform float uProgress;
uniform sampler2D uColorGradient;
uniform float uInnerGradient;
uniform float uOuterGradient;
uniform vec3 uHoverColor;
uniform float uShowHover;

float circle(vec2 st, float radius){
    vec2 dist = st - vec2(0.5);
    return 1.0 - smoothstep(radius - (radius * uInnerGradient), radius + (radius * uOuterGradient), dot(dist, dist) * 4.0);
}

void main() {
    // Visiblity
    if (step(uProgress, vProgress) > 0.0) discard;

    // Color
    vec3 color = texture2D(uColorGradient, vec2(vSettings.x, 0.5)).rgb;
    color = mix(color, uHoverColor, uShowHover);

    // Alpha
    float alpha = circle(gl_PointCoord, 1.0);
    alpha *= vSettings.w;

    // Output
    gl_FragColor = vec4(vec3(color), alpha);
}
