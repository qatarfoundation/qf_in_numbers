// Vendor
import AudioManager from '@/utils/AudioManager';

// Utils
import { Loader } from '@/vendor/resource-loader';

class PizzicatoAudioLoader extends Loader {
    /**
     * Public
     */
    load({ name, path }) {
        const promise = new Promise((resolve, reject) => {
            AudioManager.load(name, path).then((audio) => {
                resolve(audio);
            });
        });

        return promise;
    }
}

export default PizzicatoAudioLoader;
