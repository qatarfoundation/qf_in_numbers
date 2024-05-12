// https://www.shadertoy.com/view/4djSRW
//  1 out, 2 in...
float hash12(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

#pragma glslify: export(hash12)