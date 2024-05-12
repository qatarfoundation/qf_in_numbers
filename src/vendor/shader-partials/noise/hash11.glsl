// https://www.shadertoy.com/view/4djSRW
//  1 out, 1 in...
float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

#pragma glslify: export(hash11)