// https://www.shadertoy.com/view/4djSRW
float random(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

#pragma glslify: export(random)
