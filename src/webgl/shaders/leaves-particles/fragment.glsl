// Varyings
varying float vAlpha;
varying float vHoverColor;

// Uniforms
uniform float uInnerGradient;
uniform float uOuterGradient;
uniform vec3 uColor;
uniform vec3 uHoverColor1;
uniform vec3 uHoverColor2;
uniform float uOpacity;
uniform float uShowHover;

// Includes
#include <fog_pars_fragment>

float circle(vec2 st, float radius){
    vec2 dist = st - vec2(0.5);
    return 1.0 - smoothstep(radius - (radius * uInnerGradient), radius + (radius * uOuterGradient), dot(dist, dist) * 4.0);
}

void main() {
    // Alpha
    float alpha = circle(gl_PointCoord, 1.0);
    alpha *= vAlpha * uOpacity;

    vec3 hoverColor = mix(uHoverColor1, uHoverColor2, vHoverColor);
    vec3 color = mix(uColor, hoverColor, uShowHover);

    // Output
    gl_FragColor = vec4(vec3(color), alpha);

    // Fog
    #include <fog_fragment>
}
