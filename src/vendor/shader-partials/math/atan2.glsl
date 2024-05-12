#define PI 3.1415926538

float atan2(in float y, in float x) {
    bool s = (abs(x) > abs(y));
    return mix(PI / 2.0 - atan(x,y), atan(y,x), s);
}

#pragma glslify: export(atan2)