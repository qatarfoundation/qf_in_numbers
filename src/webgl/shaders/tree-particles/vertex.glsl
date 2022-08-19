// Attributes
attribute vec4 settings;
attribute float hoverColor;
attribute vec4 displacement;

// Varyings
varying vec4 vSettings;
varying float vHoverColor;
varying float vDisplacement;

// Uniforms
uniform float uRadius;
uniform float uTime;

void main() {
    // Transformed
    vec3 transformed = position;

    // Radius
    float radius = uRadius * settings.y;
    transformed += radius * normal;

    // Displacement
    transformed = vec3(transformed.x + .09 * cos(uTime + displacement.w) * displacement.x, transformed.y + .09 * sin(uTime + displacement.w) * displacement.y, transformed.z + .09 * cos(uTime + displacement.w) * displacement.z);

    // Output
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size
    gl_PointSize = float(POINT_SIZE);
    gl_PointSize *= (1.0 / -mvPosition.z);
    gl_PointSize *= settings.z;
    gl_PointSize *= 1.0 + sin(uTime * 0.3 + displacement.w * 30.0) * 0.1;

    // Varyings
    vSettings = settings;
    vHoverColor = hoverColor;
    vDisplacement = displacement.w;
}
