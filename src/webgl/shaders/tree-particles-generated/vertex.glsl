// Attributes
attribute vec4 settings;
attribute float color;

// Varyings
varying vec4 vSettings;
varying float vColor;

// Uniforms
uniform float uProgress;
uniform float uPointSize;
uniform float uRadius;

void main() {
    // Transformed
    vec3 transformed = position;

    // Output
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size
    gl_PointSize = uPointSize;
    gl_PointSize *= (1.0 / -mvPosition.z);
    gl_PointSize *= settings.y;

    // Varyings
    vSettings = settings;
    vColor = color;
}
