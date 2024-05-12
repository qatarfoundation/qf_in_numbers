import { ImageBitmapLoader, CanvasTexture } from 'three';

const loaders = {
    image: loadImage,
    texture: loadTexture,
};

onmessage = ({ data }) => {
    const callback = loaders[data.type];
    if (!callback) {
        error('No loader is available for this file type');
    } else {
        callback(data);
    }
};

function resolve(resource, data) {
    self.postMessage({ name: resource.name, type: 'succes', data });
}

function error(resource, message) {
    self.postMessage({ name: resource.name, type: 'error', message });
}

/**
 * Loaders
 */
function loadImage(resource) {
    fetch(resource.path)
        .then((response) => {
            if (response.status !== 200) {
                error(resource, `${response.status}: Could not load image with url '${resource.path}'`);
            } else {
                response.blob().then((response) => { resolve(resource, response) });
            }
        })
        .catch((err) => {
            error(err);
        });
}

async function loadTexture(resource) {
    const loader = new ImageBitmapLoader();
    loader.load(
        resource.path,
        (response) => {
            const texture = new CanvasTexture(response);
            resolve(resource, texture);
        },
        undefined,
        (err) => {
            error(resource, `${err}`);
        }
    );
}
