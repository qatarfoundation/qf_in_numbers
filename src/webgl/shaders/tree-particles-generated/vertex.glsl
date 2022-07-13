// Attributes
attribute vec4 settings;
attribute float color;
attribute vec2 displacement;

// Varyings
varying vec4 vSettings;
varying float vColor;
varying vec2 vUv;

// Uniforms
uniform float uProgress;
uniform float uPointSize;
uniform float uRadius;
uniform float uTime;

void main() {
    // Transformed
    vec3 transformed = position;

    // Output
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );

    vec3 displacedPos = vec3(position.x + .04 * cos(uTime + displacement.x * 10.) * (color - .2), position.y + .04 * sin(uTime + displacement.y * 10.) * (color - .2), position.z);

    mvPosition.xy += displacedPos.xy * uPointSize * settings.y;
	gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vSettings = settings;
    vColor = color;
    vUv = uv;
}
