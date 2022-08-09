// React
import { useEffect } from 'react';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';

function useWindowResizeObserver(callback) {
    useEffect(() => {
        WindowResizeObserver.addEventListener('resize', callback);
        return () => WindowResizeObserver.removeEventListener('resize', callback);
    }, []);

    return null;
}

export default useWindowResizeObserver;
