// React
import React, { useEffect, useRef } from 'react';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function TheNavigation() {
    const currentCategory = useStore((state) => state.currentCategory);
    const categoryName = useRef(null);
    const elRef = useRef();

    useEffect(() => {
        if (currentCategory) {
            categoryName.current = currentCategory.name;
            gsap.to(elRef.current, { duration: 1.0, alpha: 1, delay: 0.5, ease: 'sine.inOut' });
        } else {
            gsap.to(elRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' });
        }
    }, [currentCategory]);

    return (
        <h1 className="category-title" ref={ elRef }>{ categoryName.current }</h1>
    );
}

export default TheNavigation;
