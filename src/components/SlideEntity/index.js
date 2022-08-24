// React
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Vendor
import { gsap } from 'gsap';

// Utils
import math from '@/utils/math/index';
import useTick from '@/hooks/useTick';

// CSS
import './style.scoped.scss';

function SlideEntity(props, ref) {
    /**
     * Props
     */
    const { index, entity } = props;

    /**
     * Refs
     */
    const elRef = useRef();
    const activeTitleRef = useRef();

    const activeOffset = useRef({
        current: 0,
        target: 0,
    });

    /**
     * Watchers
     */
    useEffect(() => {
        activeOffset.current.target = index;
    }, [index]);

    /**
     * Public
     */

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({

    }));

    /**
     * Private
     */
    function updateActiveOffset() {
        activeOffset.current.current = math.lerp(activeOffset.current.current, activeOffset.current.target, 0.3);
    }

    function updateOpacity() {
        if (!elRef.current) return;

        const alphaOffset = 1 - (activeOffset.current.current) / 2.5;
        const globalAlpha = math.clamp(activeOffset.current.current + 1, 0, 1);
        const activeAlpha = 1 - math.clamp(Math.abs(activeOffset.current.current), 0, 1);

        elRef.current.style.opacity = alphaOffset * globalAlpha;

        // activeTitleRef.current.style.opacity = activeAlpha;
    }

    /**
     * Events
     */
    useTick(tickHandler);

    function tickHandler() {
        updateActiveOffset();
        updateOpacity();
    }

    return (
        <div ref={ elRef } className={ `slide-entity ${ index === 0 ? 'first' : '' }` }>

            <p className="slide-entity-title p1">{ entity.name }</p>

            { /* <p ref={ activeTitleRef } className="slide-entity-title active p1">{ entity.name }</p> */ }

        </div>
    );
}

export default forwardRef(SlideEntity);
