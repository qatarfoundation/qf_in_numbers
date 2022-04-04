attribute float progress;
attribute float offset;

varying float vProgress;
varying float vOffset;
varying vec2 vUv;

void main() {
    vec4 mvPosition =  modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 3.0;
    gl_PointSize *= (10.0 / -mvPosition.z);

    vProgress = progress;
    vOffset = offset;
    vUv = uv;
}
