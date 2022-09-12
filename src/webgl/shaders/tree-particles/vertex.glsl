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
    float amplitude = 0.3;
    float speed = 0.6;
    float time = uTime * speed;
    transformed = vec3(transformed.x + amplitude * cos(time + displacement.w) * displacement.x, transformed.y + amplitude * sin(time + displacement.w) * displacement.y, transformed.z + amplitude * cos(time + displacement.w) * displacement.z);

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
