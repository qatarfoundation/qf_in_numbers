// Vendor
import { useEffect, useState } from 'react';
import { ResourceLoader } from 'resource-loader';

// Loaders
import ImageLoader from 'loaders/image-loader';
import ThreeGLTFDracoLoader from 'loaders/three-gltf-draco-loader';

// Configs
import globalResources from '@/configs/globalResources.js';

// Register loaders
ResourceLoader.registerLoader(ImageLoader, 'image');
ResourceLoader.registerLoader(ThreeGLTFDracoLoader, 'gltf');

// States
export const LOADING = 'LOADING';
export const COMPLETE = 'COMPLETE';

export default function usePreloader() {
    const [state, setState] = useState(LOADING);

    useEffect(() => {
        const resourceLoader = new ResourceLoader();

        // Global resources
        resourceLoader.add({
            resources: globalResources,
            preload: true,
        });

        const handleComplete = () => setState(COMPLETE);
        resourceLoader.addEventListener('complete', handleComplete);
        resourceLoader.preload();

        return () => {
            resourceLoader.removeEventListener('complete', handleComplete);
        };
    });

    return state;
}
