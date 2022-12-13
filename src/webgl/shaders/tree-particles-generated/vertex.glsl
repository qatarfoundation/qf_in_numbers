// Attributes
attribute vec4 settings;
attribute float color;
attribute vec2 displacement;
attribute float progress;

// Varyings
varying vec4 vSettings;
varying float vColor;
varying vec2 vUv;
varying float vProgress;

// Uniforms
uniform float uProgress;
uniform float uPointSize;
uniform float uRadius;
uniform float uTime;

void main() {
    // Transformed
    vec3 transformed = position;

    float amplitude = 0.1;
    float speed = 1.0;

    float x = position.x + amplitude * cos(uTime * speed + displacement.x * 10.) * (color - .2);
    float y = position.y + amplitude * sin(uTime * speed + displacement.y * 10.) * (color - .2);
    float z = position.z;
    transformed = vec3(x, y, z);

    // Output
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    mvPosition.xy += transformed.xy * uPointSize * settings.y;
	gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vSettings = settings;
    vColor = color;
    vUv = uv;
    vProgress = progress;
}
