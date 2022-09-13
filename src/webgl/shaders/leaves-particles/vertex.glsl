// Attributes
attribute float offset;
attribute float scale;
attribute float alpha;
attribute float hoverColor;
attribute vec4 displacement;

// Varyings
varying float vOffset;
varying float vAlpha;
varying float vHoverColor;

// Uniforms
uniform float uPointSize;
uniform float uTime;

// Includes
#include <fog_pars_vertex>

void main() {
    vec3 transformed = position;

    // Displacement
    float amplitude = 0.3;
    float speed = 0.6;
    float time = uTime * speed;
    transformed = vec3(transformed.x + amplitude * cos(time + displacement.w) * displacement.x, transformed.y + amplitude * sin(time + displacement.w) * displacement.y, transformed.z + amplitude * cos(time + displacement.w) * displacement.z);

    // Output
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size
    gl_PointSize = uPointSize;
    gl_PointSize *= (1.0 / -mvPosition.z);
    gl_PointSize *= scale;

    // Varyings
    vAlpha = alpha;
    vOffset = offset;
    vHoverColor = hoverColor;

    // Fog
    #include <fog_vertex>
}
