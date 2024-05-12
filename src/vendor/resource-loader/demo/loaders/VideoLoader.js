import { Loader } from '../../src/index';

class VideoLoader extends Loader {
    /**
     * Public
     */
    load({ path }) {
        const video = document.createElement('video');

        const promise = new Promise((resolve, reject) => {
            video.addEventListener('canplay', () => {
                resolve(video);
            });
            video.addEventListener('error', reject);
        });

        video.setAttribute('src', path);

        return promise;
    }
}

export default VideoLoader;
