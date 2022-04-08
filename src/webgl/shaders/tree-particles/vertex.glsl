// Attributes
attribute float progress;
attribute vec4 settings;
attribute vec3 color;

// Varyings
varying float vProgress;
varying vec4 vSettings;
varying vec3 vColor;

// Uniforms
uniform float uProgress;
uniform float uPointSize;
uniform float uRadius;

void main() {
    // Transformed
    vec3 transformed = position;

    // Radius
    float radius = uRadius * settings.y * max(0.1, smoothstep(uProgress, progress - 0.08, progress));
    transformed += radius * normal;

    // Output
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size
    gl_PointSize = uPointSize;
    gl_PointSize *= (1.0 / -mvPosition.z);
    gl_PointSize *= settings.z;

    // Varyings
    vProgress = progress;
    vSettings = settings;
    vColor = color;
}
