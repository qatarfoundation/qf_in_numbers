// Vendor
import { gsap } from 'gsap';

// React
import { useEffect } from 'react';

function useTick(callback) {
    useEffect(() => {
        gsap.ticker.add(callback);
        return () => gsap.ticker.remove(callback);
    }, []);

    return null;
}

export default useTick;
