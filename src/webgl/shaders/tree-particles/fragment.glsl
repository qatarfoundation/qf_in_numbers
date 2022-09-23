// Varyings
varying vec4 vSettings;
varying float vHoverColor;
varying float vDisplacement;

// Uniforms
uniform sampler2D uColorGradient;
uniform float uInnerGradient;
uniform float uOuterGradient;
uniform vec3 uHoverColor1;
uniform vec3 uHoverColor2;
uniform float uShowHover;
uniform float uOpacity;
uniform float uDisabled;
uniform float uTime;
uniform sampler2D uParticle;
uniform vec2 uResolution;

void main() {
    // Color
    vec3 color = texture2D(uColorGradient, vec2(vSettings.x, 0.5)).rgb;
    vec3 hoverColor = mix(uHoverColor1, uHoverColor2, vHoverColor);
    color = mix(color, hoverColor, uShowHover);

    // Alpha
    float alpha = texture2D(uParticle, gl_PointCoord.xy).r;
    alpha *= vSettings.w;
    alpha *= uOpacity;
    alpha *= 1.0 + uShowHover * 3.0;

    float y = gl_FragCoord.y / uResolution.y;
    alpha *= smoothstep(-0.2, 0.5, y);

    alpha *= uDisabled;

    // float alphaBlinkSpeed = 0.5;
    // alpha *= clamp(cos((uTime * alphaBlinkSpeed) + vDisplacement * 30.), clamp(vDisplacement + .5, .1, .5), 1.);

    // Output
    gl_FragColor = vec4(vec3(color), alpha);
}
