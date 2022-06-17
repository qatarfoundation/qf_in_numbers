// Attributes
attribute float size;
attribute float color;

// Varyings
varying vec2 vUv;
varying float vColor;

// Uniforms
uniform float uPointSize;

void main() {
    // Transformed
    vec3 transformed = position;

    // Output
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    mvPosition.xy += position.xy * uPointSize * size;
	gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vUv = uv;
    vColor = color;
}
