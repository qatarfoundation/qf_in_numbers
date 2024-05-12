// https://www.shadertoy.com/view/4djSRW
// 4 out, 1 in...
vec4 hash41(float p) {
    vec4 p4 = fract(vec4(p) * vec4(0.1031, 0.1030, 0.0973, 0.1099));
    p4 += dot(p4, p4.wzxy + 33.33);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

#pragma glslify: export(hash41)