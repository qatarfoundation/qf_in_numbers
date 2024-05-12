vec4 vignette(vec4 color, vec2 uv, float offset, float darkness) {
    const vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    color.rgb *= smoothstep(0.8, offset * 0.799, dist * (darkness + offset));
    return color;
}

#pragma glslify: export(vignette)
