// Vendor
import { useEffect, useState } from 'react';
import { ResourceLoader } from 'resource-loader';

// Loaders
import ImageLoader from 'loaders/image-loader';

// Configs
import globalResources from '@/configs/globalResources.js';

// Register loaders
ResourceLoader.registerLoader(ImageLoader, 'image');

export default function useResourceLoader() {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const resourceLoader = new ResourceLoader();

        // Global resources
        resourceLoader.add({
            resources: globalResources,
            preload: true,
        });

        const handleComplete = () => setVisible(false);
        resourceLoader.addEventListener('complete', handleComplete);
        resourceLoader.preload();

        return () => {
            resourceLoader.removeEventListener('complete', handleComplete);
        };
    });
    return visible;
}
