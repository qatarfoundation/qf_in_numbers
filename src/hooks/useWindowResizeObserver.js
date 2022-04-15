// React
import { useEffect } from 'react';

// Utils
// import WindowResizeObserver from '@/utils/WindowResizeObserver';

const useWindowResizeObserver = (callback) => {
    useEffect(() => {
        // WindowResizeObserver.addEventListener('resize', callback);
        // return () => WindowResizeObserver.removeEventListener('resize', callback);
        window.addEventListener('resize', callback);
        return () => window.removeEventListener('resize', callback);
    }, []);

    return null;
};

export default useWindowResizeObserver;
