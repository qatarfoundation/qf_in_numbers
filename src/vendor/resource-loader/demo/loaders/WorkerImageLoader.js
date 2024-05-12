import { Loader } from '../../src/index';

class WorkerImageLoader extends Loader {
    /**
     * Public
     */
    load({ path, type, name }) {
        const workerLoader = this.worker;

        workerLoader.postMessage({
            name,
            type,
            path
        });

        const promise = new Promise((resolve, reject) => {
            workerLoader.addEventListener('message', ({ data }) => {
                if (data.name !== name) return;
                if (data.type === 'succes') {
                    const objectURL = URL.createObjectURL(data.data);
                    const imageElement = new Image();
                    imageElement.setAttribute('src', objectURL);
                    imageElement.addEventListener('load', () => { URL.revokeObjectURL(objectURL) });
                    resolve(imageElement);
                } else {
                    reject(new Error(data.message));
                }
            });
        });

        return promise;
    }
}

export default WorkerImageLoader;
