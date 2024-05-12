import { Loader } from '../../src/index';

class ImageLoader extends Loader {
    /**
     * Public
     */
    load({ path, name }) {
        const image = new Image();
        image.setAttribute('src', path);

        const promise = new Promise((resolve, reject) => {
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.addEventListener('error', () => {
                reject(new Error(`ImageLoader : Error while loading resource "${name}"`));
            });
        });

        return promise;
    }
}

export default ImageLoader;
