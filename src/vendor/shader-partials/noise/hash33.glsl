// https://www.shadertoy.com/view/4djSRW
//  3 out, 3 in...
vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
}

#pragma glslify: export(hash33)