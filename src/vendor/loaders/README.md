# loaders

You can shop here helpful loaders to use with [resource-loader](https://github.com/immersive-garden/resource-loader)

## Usage

```bash
npm install github:immersive-garden/loaders
```

```js
import ResourceLoader from 'resource-loader';
import ThreeTextureLoader from 'loaders/three-texture-loader';

ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');
```

### With options

```js
import ResourceLoader from 'resource-loader';
import ThreeGLTFDracoLoader from 'loaders/three-gltf-draco-loader';

ResourceLoader.registerLoader(ThreeGLTFDracoLoader, 'gltf', {
    dracoDecoderPath: '/libs/draco/',
});
```

## Available loaders

### Basics

-   [image-loader](https://github.com/immersive-garden/loaders/blob/master/image-loader/src/index.js)

```js
import ImageLoader from 'loaders/image-loader';
```
```js
ResourceLoader.registerLoader(ImageLoader, 'image');
```

-   [json-loader](https://github.com/immersive-garden/loaders/blob/master/json-loader/src/index.js)

```js
import JSONLoader from 'loaders/json-loader';
```
```js
ResourceLoader.registerLoader(JSONLoader, 'json');
```

-   [svg-loader](https://github.com/immersive-garden/loaders/blob/master/svg-loader/src/index.js)

```js
import SVGLoader from 'loaders/svg-loader';
```
```js
ResourceLoader.registerLoader(SVGLoader, 'svg');
```

### Three.js

-   [three-gltf-draco-loader](https://github.com/immersive-garden/loaders/blob/master/three-gltf-draco-loader/src/index.js)

```js
import ThreeGLTFDracoLoader from 'loaders/three-gltf-draco-loader';
```
```js
ResourceLoader.registerLoader(ThreeGLTFDracoLoader, 'glb');
```

-   [three-ktx2-texture-loader](https://github.com/immersive-garden/loaders/blob/master/three-ktx2-texture-loader/src/index.js)

```js
import ThreeKTX2TextureLoader from 'loaders/three-ktx2-texture-loader';
```
```js
ResourceLoader.registerLoader(ThreeKTX2TextureLoader, 'ktx');
```

-   [three-basis-texture-loader](https://github.com/immersive-garden/loaders/blob/master/three-basis-texture-loader/src/index.js)

```js
import ThreeBasisTextureLoader from 'loaders/three-basis-texture-loader';
```
```js
ResourceLoader.registerLoader(ThreeBasisTextureLoader, 'basis');
```

-   [three-texture-loader](https://github.com/immersive-garden/loaders/blob/master/three-texture-loader/src/index.js)

```js
import ThreeTextureLoader from 'loaders/three-texture-loader';
```
```js
ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');
```

-   [three-obj-loader](https://github.com/immersive-garden/loaders/blob/master/three-obj-loader/src/index.js)

```js
import ThreeOBJLoader from 'loaders/three-obj-loader';
```
```js
ResourceLoader.registerLoader(ThreeOBJLoader, 'obj');
```

## Adding loaders

```bash
npm install
```

You will find a directory 'loader-template', you can duplicate it.
Change directory name and package.json name. Please try to find a very explicit name.

If the loader is based on a specific dependency, make sure to prefix
the loader name with the dependency name.

If you're using dependencies that will also be used inside a project where the loader should be used (for example three.js based loaders),
make sure to move it to peerDependencies in package.json.

Then you can write your loader inside my-loader/src/index.js.

Build it:

```bash
// Go to the right directory
cd my-loader

// Install dependencies
npm install

// Build
npm run build
```
