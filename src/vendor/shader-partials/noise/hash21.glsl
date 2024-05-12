// https://www.shadertoy.com/view/4djSRW
//  2 out, 1 in...
vec2 hash21(float p) {
    vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);

}

#pragma glslify: export(hash21)