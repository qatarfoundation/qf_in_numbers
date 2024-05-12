// https://www.shadertoy.com/view/4djSRW
//  1 out, 3 in...
float hash13(vec3 p3) {
    p3  = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

#pragma glslify: export(hash13)