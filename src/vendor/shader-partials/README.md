# Shader partials

Collection of shader partials

## Installation

``` bash
npm i github:immersive-garden/shader-partials
```

## Partials

### Math
``` glsl
#pragma glslify: atan2 = require(shader-partials/math/atan2)
#pragma glslify: cubicPulse = require(shader-partials/math/cubicPulse)
#pragma glslify: mapRange = require(shader-partials/math/mapRange)
#pragma glslify: rotateUV = require(shader-partials/math/rotateUV)
```

### Color
``` glsl
#pragma glslify: hueShift = require(shader-partials/color/hueShift)
#pragma glslify: saturation = require(shader-partials/color/saturation)
```

### Noise
``` glsl
#pragma glslify: curlNoise = require(shader-partials/noise/curlNoise)
#pragma glslify: hash11 = require(shader-partials/noise/hash11)
#pragma glslify: hash12 = require(shader-partials/noise/hash12)
#pragma glslify: hash13 = require(shader-partials/noise/hash13)
#pragma glslify: hash21 = require(shader-partials/noise/hash21)
#pragma glslify: hash22 = require(shader-partials/noise/hash22)
#pragma glslify: hash23 = require(shader-partials/noise/hash23)
#pragma glslify: hash31 = require(shader-partials/noise/hash31)
#pragma glslify: hash32 = require(shader-partials/noise/hash32)
#pragma glslify: hash33 = require(shader-partials/noise/hash33)
#pragma glslify: hash41 = require(shader-partials/noise/hash41)
#pragma glslify: hash42 = require(shader-partials/noise/hash42)
#pragma glslify: hash43 = require(shader-partials/noise/hash43)
#pragma glslify: hash44 = require(shader-partials/noise/hash44)
```

### Effects
``` glsl
#pragma glslify: vignette = require(shader-partials/effects/vignette)
```

## Todo
- [ ] Add color conversion partials
- [ ] Validate all sources