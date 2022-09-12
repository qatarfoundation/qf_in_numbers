#define USE_FOG

// Varyings
varying float vColorOffset;
varying float vAlpha;

// Uniforms
uniform sampler2D uColorGradient;
uniform float uOpacity;
uniform sampler2D uParticle;
uniform vec2 uResolution;

// Includes
#include <fog_pars_fragment>

void main() {
    // Color
    vec3 color = texture2D(uColorGradient, vec2(vColorOffset, 0.5)).rgb;

    // Alpha
    float alpha = texture2D(uParticle, gl_PointCoord.xy).r;
    alpha *= uOpacity;
    alpha *= vAlpha;

    float y = gl_FragCoord.y / uResolution.y;
    alpha *= smoothstep(-0.2, 0.5, y);

    // Output
    gl_FragColor = vec4(vec3(color), alpha);

    // Custom fog
    #ifdef USE_FOG
        #ifdef FOG_EXP2
            float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
        #else
            float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
        #endif
        gl_FragColor.a *= fogFactor;
    #endif
}
