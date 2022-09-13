// Attributes
attribute float size;
attribute vec2 displacement;

// Varyings
varying vec2 vUv;

// Uniforms
uniform float uPointSize;
uniform float uTime;

void main() {
    // Transformed
    vec3 transformed = position;

    float amplitude = 0.1;
    float speed = 0.5;

    float x = position.x + amplitude * cos(uTime * speed + displacement.x * 10.);
    float y = position.y + amplitude * sin(uTime * speed + displacement.y * 10.);
    float z = position.z;
    transformed = vec3(x, y, z);

    // Output
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    mvPosition.xy += transformed.xy * uPointSize * size;
	gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vUv = uv;
}
