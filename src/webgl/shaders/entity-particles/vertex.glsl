// Attributes
attribute float size;
attribute float color;
attribute vec2 displacement;

// Varyings
varying vec2 vUv;
varying float vColor;

// Uniforms
uniform float uPointSize;
uniform float uTime;

void main() {
    // Transformed
    vec3 transformed = position;

    // Output
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );

    vec2 displacedPos = vec2(position.x + .4 * cos(uTime + displacement.x * 10.) * (color - .3), position.y + .4 * sin(uTime + displacement.y * 10.) * (color - .3));

    mvPosition.xy += displacedPos.xy * uPointSize * size;
	gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vUv = uv;
    vColor = color;
}
