# Resource loader

The goal is to make it fairly easy to preload resources for both production and development environment and establish the right preloading strategy for any project by choosing precisely what to preload and when. It's also possible to add your own custom loaders.

## Installation

```bash
npm i github:immersive-garden/resource-loader
```

## Usage

### Basic

```js
import { ResourceLoader } from 'resource-loader';
import resources from '@/resources';
import CustomImageLoader from '@/loaders/CustomImageLoader';

// Set base path for relative url (optional)
ResourceLoader.basePath = '/public';

// Register the loaders you need
ResourceLoader.registerLoader(CustomImageLoader, 'image');

// Create instance
const resourceLoader = new ResourceLoader();

// Add resources
resourceLoader.add({ resources });

// Add resources and set namespace
resourceLoader.add({
    resources,
    namespace: 'home', // Will set namespace to every resource item (overrides if already defined)
});

// Add resources and set preload
resourceLoader.add({
    resources,
    preload: false, // Will set preload option to every resource item if not defined (default is true)
});

// Start preloading
resourceLoader.preload();

// Handle load complete
resourceLoader.addEventListener('complete', () => {
    // Get resource
    const image = ResourceLoader.get('my-image');
});
```

### Adding Resource Manager

```js
import { ResourceLoader, ResourceManager } from 'resource-loader';
```

#### Add resources by namespace

```js
// ...

// Setup resource manager
const resourceManager = new ResourceManager({
    namespace: 'home',
});

resourceManager.load();

// Handle load complete
resourceManager.addEventListener('complete', () => {
    const image = resourceManager.get('my-image');
});
```

#### Add specific resources

```js
// ...

// Setup resource manager
const resourceManager = new ResourceManager();

// Add existing resource by its name
resourceManager.addByName('my-asset');
// Or multiple
resourceManager.addByName(['my-asset-1', 'my-asset-2']);

// Add brand new resource
resourceManager.add({
    name: 'test-add-resource',
    type: 'image',
    path: 'https://picsum.photos/400/1000',
    options: { preload: false },
});
// Or multiple
resourceManager.add([resource1, resource2]);

resourceManager.load();
```

### Example of resource file

```js
// resources.js
const resources = [
    {
        name: 'test-0',
        type: 'image',
        path: 'https://picsum.photos/200/300',
        namespace: 'home',
    },
    {
        name: 'test-1',
        type: 'image',
        path: 'https://picsum.photos/1920/1080',
        namespace: 'about',
        preload: false,
    },
    {
        name: 'test-2',
        type: 'video',
        path: 'intro.mp4',
        preload: true,
    },
    {
        name: 'test-3',
        type: 'video',
        path: 'loop.mp4',
        preload: true,
        options: {
            loop: true,
            autoplay: true,
        },
    },
];
```

### Example of loader class

You can create your own loaders by creating classes that extends the base class Loader, with a load method returning a promise.

```js
// CustomImageLoader.js

import { Loader } from 'resource-loader';

class CustomImageLoader extends Loader {
    load({ path }) {
        const image = new Image();
        image.crossOrigin = '';

        const promise = new Promise((resolve, reject) => {
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.addEventListener('error', (err) => {
                reject(err);
            });
        });

        image.src = path;

        return promise;
    }
}

export default CustomImageLoader;
```

## API

### ResourceLoader

#### Properties

-   `resources`: Array(Object)
-   `cache`: Array(Object)
-   `basePath`: String
-   `loaders`: Object
-   `preloadByDefault`: Bool (Default is false)

#### Methods

-   `instance.add(options: Object)`: Array(Object)
-   `instance.preload()`: Promise(Array)
-   `instance.addEventListener(eventName: String, callback: function)`: Void
-   `instance.removeEventListener(eventName: String, callback: function)`: Void
-   `load(resourceName: String)`: Promise(Object)
-   `get(resourceName: String)`: Object
-   `registerLoader(CustomLoader: Loader, type: String, options: Object)`: Void
-   `getLoader(type: String)`: Void

#### Events

-   `start`
-   `progress`
-   `complete`
-   `error`

### ResourceManager

#### Properties

-   `resources`: Array(Object)
-   `isComplete`: Bool

#### Methods

-   `instance.add(resource: Object or resources: Array(Object))`: Void
-   `instance.addByName(resourceName: String or resourceNames: Array(String))`: Void
-   `instance.load(all: Bool)`: Promise(Array)
-   `instance.get(resourceName: String)`: Object
-   `instance.destroy()`: Void
-   `addEventListener(eventName: String, callback: function)`: Void
-   `removeEventListener(eventName: String, callback: function)`: Void

#### Events

-   `start`
-   `progress`
-   `complete`
-   `error`

### Loader

#### Properties

-   `type`: String
-   `worker`: Worker

#### Methods

-   `instance.load(resource: Object)`: Promise(Object)

## Run demo

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3003
npm run dev
```

## Development

Pushing to master triggers a build via Github Action. We still need to define versions to work more safely.

## Build

```bash
npm run build
```
