// Varyings
varying float vAlpha;

// Uniforms
uniform float uInnerGradient;
uniform float uOuterGradient;
uniform vec3 uColor;
uniform float uOpacity;

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

    // Output
    gl_FragColor = vec4(vec3(uColor), alpha);

    // Fog
    #include <fog_fragment>
}
