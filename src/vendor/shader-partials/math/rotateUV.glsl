// https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd <3
vec2 rotateUV(vec2 uv, float rotation) {
    float center = 0.5;
    float cosAngle = cos(rotation);
    float sinAngle = sin(rotation);
    return vec2(
        cosAngle * (uv.x - center) + sinAngle * (uv.y - center) + center,
        cosAngle * (uv.y - center) - sinAngle * (uv.x - center) + center
    );
}

vec2 rotateUV(vec2 uv, float rotation, vec2 center) {
    float cosAngle = cos(rotation);
    float sinAngle = sin(rotation);
    return vec2(
        cosAngle * (uv.x - center.x) + sinAngle * (uv.y - center.y) + center.x,
        cosAngle * (uv.y - center.y) - sinAngle * (uv.x - center.x) + center.y
    );
}

vec2 rotateUV(vec2 uv, float rotation, float center) {
    float cosAngle = cos(rotation);
    float sinAngle = sin(rotation);
    return vec2(
        cosAngle * (uv.x - center) + sinAngle * (uv.y - center) + center,
        cosAngle * (uv.y - center) - sinAngle * (uv.x - center) + center
    );
}

#pragma glslify: export(rotateUV)