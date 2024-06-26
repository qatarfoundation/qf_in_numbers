// Varyings
varying float vOffset;
varying float vAlpha;

// Uniforms
uniform sampler2D uColorGradient;
uniform float uInnerGradient;
uniform float uOuterGradient;

// Includes
#include <fog_pars_fragment>

float circle(vec2 st, float radius){
    vec2 dist = st - vec2(0.5);
    return 1.0 - smoothstep(radius - (radius * uInnerGradient), radius + (radius * uOuterGradient), dot(dist, dist) * 4.0);
}

void main() {
    // Color
    vec3 color = texture2D(uColorGradient, vec2(vOffset, 0.5)).rgb;

    // Alpha
    float alpha = circle(gl_PointCoord, 1.0);
    alpha *= vAlpha;

    // Output
    gl_FragColor = vec4(vec3(color), alpha);

    // Fog
    #include <fog_fragment>
}
