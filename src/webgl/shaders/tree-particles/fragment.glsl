varying float vProgress;
varying float vOffset;
varying vec2 vUv;

uniform float uProgress;

#pragma glslify: hueShift = require(shader-partials/color/hueShift)

float circle(vec2 _st, float _radius){
    vec2 dist = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*1.), _radius+(_radius*0.3), dot(dist,dist)*4.0);
}

void main() {

    if (step(uProgress, vProgress) > 0.) discard;

    vec3 uColor = vec3(6.0 / 255.0, 140.0 / 255.0, 154.0 / 255.0);

    float offset = vOffset * 2.0 - 1.0;
    uColor = hueShift(uColor, offset);

    float alpha = circle(gl_PointCoord, 1.0);

    gl_FragColor = vec4(vec3(uColor), alpha);
}
