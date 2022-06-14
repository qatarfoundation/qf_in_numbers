// Attributes
attribute vec4 settings;
attribute float color;

// Varyings
varying vec4 vSettings;
varying float vColor;
varying vec2 vUv;

// Uniforms
uniform float uProgress;
uniform float uPointSize;
uniform float uRadius;

void main() {
    // Transformed
    vec3 transformed = position;

    // Output
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    mvPosition.xy += position.xy * uPointSize * settings.y;
	gl_Position = projectionMatrix * mvPosition;

    // Varyings
    vSettings = settings;
    vColor = color;
    vUv = uv;
}
