// React
import React, { useRef, useEffect } from 'react';

// Vendor
import { gsap } from 'gsap';

// Utils
import math from '@/utils/math/index';

// CSS
import './style.scoped.scss';

function SlideEntityMobile(props) {
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
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        setupEventListeners();
    }

    function destroy() {
        removeEventListeners();
    }

    /**
     * Public
     */

    /**
     * Private
     */
    function updateActiveOffset() {
        activeOffset.current.current = math.lerp(activeOffset.current.current, activeOffset.current.target, 0.1);
    }

    function updateOpacity() {
        if (!elRef.current) return;

        const alphaOffset = 1 - (activeOffset.current.current) / 1;
        const globalAlpha = math.clamp(activeOffset.current.current + 1, 0, 1);
        const activeAlpha = 1 - math.clamp(Math.abs(activeOffset.current.current), 0, 1);

        elRef.current.style.opacity = alphaOffset * globalAlpha;

        activeTitleRef.current.style.opacity = activeAlpha;
    }

    /**
     * Events
     */
    function setupEventListeners() {
        gsap.ticker.add(tickHandler);
    }

    function removeEventListeners() {
        gsap.ticker.remove(tickHandler);
    }

    function tickHandler() {
        updateActiveOffset();
        updateOpacity();
    }

    return (
        <div ref={ elRef } className="slide-entity-mobile">

            <p className="slide-entity-title p1">{ entity.name }</p>

            <p ref={ activeTitleRef } className="slide-entity-title active p1">{ entity.name }</p>

        </div>
    );
}

export default SlideEntityMobile;
