// Attributes
attribute float offset;
attribute float scale;
attribute float alpha;

// Varyings
varying float vOffset;
varying float vAlpha;

// Uniforms
uniform float uPointSize;

// Includes
#include <fog_pars_vertex>

void main() {
    // Output
    vec4 mvPosition =  modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size
    gl_PointSize = uPointSize;
    gl_PointSize *= (1.0 / -mvPosition.z);
    gl_PointSize *= scale;

    // Varyings
    vAlpha = alpha;
    vOffset = offset;

    // Fog
    #include <fog_vertex>
}
