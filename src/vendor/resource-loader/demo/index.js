import resources from './resources';
import ResourceLoader, { ResourceManager } from '../src/index';

// Loaders
import ImageLoader from './loaders/ImageLoader';

// Resource Loader
ResourceLoader.basePath = '/public';

// Loaders
ResourceLoader.registerLoader(ImageLoader, 'image', { decoderPath: 'decoderPath' });

// Create instance
const resourceLoader = new ResourceLoader();

console.log(resources);

resourceLoader.add({
    resources,
    namespace: 'home',
});

resourceLoader.add({
    resources: [
        {
            name: 'my-asset-0',
            type: 'image',
            path: 'https://picsum.photos/400/600?grayscale',
            preload: false,
        },
    ],
    namespace: 'about',
});

resourceLoader.preload();

resourceLoader.addEventListener('complete', () => {
    console.log('complete', ResourceLoader.cache);
});

// // Resource Manager
const resourceManagerHome = new ResourceManager({
    namespace: 'home',
});

resourceManagerHome.load();

const resourceManagerAbout = new ResourceManager({
    namespace: 'about',
});

// resourceManager.addEventListener('progress', () => {
//     console.log('progress');
// });

resourceManagerHome.addEventListener('complete', () => {
    console.log('complete Home');
    resourceManagerAbout.load();
});

resourceManagerAbout.addEventListener('complete', () => {
    console.log('complete About');
});

// resourceLoader.destroy();
// resourceManager.destroy();
// console.log(resourceLoader);
