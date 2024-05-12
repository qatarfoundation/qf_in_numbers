import { Loader } from '../../src/index';

class WorkerTextureLoader extends Loader {
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
                    resolve(data.data);
                } else {
                    reject(data.message);
                }
            });
        });

        return promise;
    }
}

export default WorkerTextureLoader;
