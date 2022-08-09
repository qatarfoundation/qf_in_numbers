// Vendor
import { ResourceLoader } from 'resource-loader';

// React
import { useEffect, useState } from 'react';

// Loaders
import ImageLoader from 'loaders/image-loader';
import TextureLoader from '@/vendor/ThreeTextureLoader';
import ThreeGLTFDracoLoader from '@/vendor/ThreeGLTFDracoLoader';

// Utils
import Globals from '@/utils/Globals';

// Configs
import globalResources from '@/configs/globalResources.js';
import viewsData from '@/webgl/configs/views';

// Contexts
import { DEVELOPMENT, useEnvironment } from '@/contexts/EnvironmentContext';

// Register loaders
ResourceLoader.registerLoader(ImageLoader, 'image');
ResourceLoader.registerLoader(TextureLoader, 'texture');
ResourceLoader.registerLoader(ThreeGLTFDracoLoader, 'gltf');

// States
export const LOADING = 'LOADING';
export const COMPLETE = 'COMPLETE';

function usePreloader() {
    const [state, setState] = useState(LOADING);
    const [progress, setProgress] = useState(0);
    const environment = useEnvironment();

    useEffect(() => {
        const resourceLoader = new ResourceLoader();
        const isDevelopment = environment === DEVELOPMENT;

        const handleProgress = (p) => {
            setProgress(p);
        };

        const handleComplete = () => {
            Globals.isResourcesLoaded = true;
            setState(COMPLETE);
        };

        if (Globals.isResourcesLoaded)  {
            setState(COMPLETE);
        } else {
            // Global resources
            resourceLoader.add({
                resources: globalResources,
                preload: true,
            });

            // View resources
            addViewsResouces(resourceLoader, isDevelopment);
            resourceLoader.addEventListener('progress', handleProgress);
            resourceLoader.addEventListener('complete', handleComplete);
            resourceLoader.preload();
        }

        return () => {
            resourceLoader.removeEventListener('progress', handleProgress);
            resourceLoader.removeEventListener('complete', handleComplete);
        };
    }, []);

    return { state, progress };
}

function addViewsResouces(resourceLoader, isDevelopment) {
    for (const view of viewsData) {
        let preload = false;
        if (isDevelopment && view.resources.preload.development) {
            preload = true;
        } else if (!isDevelopment && view.resources.preload.production) {
            preload = true;
        }

        resourceLoader.add({
            resources: view.resources.items,
            namespace: view.name,
            preload,
        });
    }
}

export default usePreloader;
