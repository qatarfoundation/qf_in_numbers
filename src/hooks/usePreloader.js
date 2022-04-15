// Vendor
import { useEffect, useState } from 'react';
import { ResourceLoader } from 'resource-loader';

// Loaders
import ImageLoader from 'loaders/image-loader';
import TextureLoader from 'loaders/three-texture-loader';
import ThreeGLTFDracoLoader from 'loaders/three-gltf-draco-loader';

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
    const environment = useEnvironment();

    useEffect(() => {
        const resourceLoader = new ResourceLoader();
        const isDevelopment = environment === DEVELOPMENT;

        // Global resources
        resourceLoader.add({
            resources: globalResources,
            preload: true,
        });

        // View resources
        addViewsResouces(resourceLoader, isDevelopment);

        const handleComplete = () => setState(COMPLETE);
        resourceLoader.addEventListener('complete', handleComplete);
        resourceLoader.preload();

        return () => {
            resourceLoader.removeEventListener('complete', handleComplete);
        };
    }, []);

    return state;
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
