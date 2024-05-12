// https://www.shadertoy.com/view/4djSRW
//  3 out, 1 in...
vec3 hash31(float p) {
   vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
   p3 += dot(p3, p3.yzx + 33.33);
   return fract((p3.xxy + p3.yzz) * p3.zyx); 
}

#pragma glslify: export(hash31)