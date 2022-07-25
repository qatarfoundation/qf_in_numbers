// Varyings
varying float vProgress;
varying vec4 vSettings;
varying float vHoverColor;
varying float vDisplacement;

// Uniforms
uniform float uProgress;
uniform sampler2D uColorGradient;
uniform float uInnerGradient;
uniform float uOuterGradient;
uniform vec3 uHoverColor1;
uniform vec3 uHoverColor2;
uniform float uShowHover;
uniform float uOpacity;
uniform float uTime;

float circle(vec2 st, float radius){
    vec2 dist = st - vec2(0.5);
    return 1.0 - smoothstep(radius - (radius * uInnerGradient), radius + (radius * uOuterGradient), dot(dist, dist) * 4.0);
}

void main() {
    // Visiblity
    if (step(uProgress, vProgress) > 0.0) discard;

    // Color
    vec3 color = texture2D(uColorGradient, vec2(vSettings.x, 0.5)).rgb;
    vec3 hoverColor = mix(uHoverColor1, uHoverColor2, vHoverColor);
    color = mix(color, hoverColor, uShowHover);

    // Alpha
    float alpha = circle(gl_PointCoord, 1.0);
    alpha *= vSettings.w;
    alpha *= uOpacity;

    alpha *= clamp(cos(uTime + vDisplacement * 30.), clamp(vDisplacement + .5, .1, .5), 1.);

    // Output
    gl_FragColor = vec4(vec3(color), alpha);
    // gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), alpha);
}

// void main() {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// }
