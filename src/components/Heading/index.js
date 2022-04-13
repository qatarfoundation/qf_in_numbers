// React
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

// Vendor
import gsap from 'gsap';

// CSS
import './style.scoped.scss';

const Heading = (props, ref) => {
    /**
     * Refs
     */
    const el = useRef();

    /**
     * Public
     */
    function show() {
        return gsap.fromTo(el.current, { x: -100 }, { duration: 1, x: 0, ease: 'sine.inOut' });
    }

    function hide() {
        return gsap.to(el.current, { duration: 0.5, x: 100, ease: 'sine.inOut' });
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    return (
        <h1 className="heading" ref={ el }>{ props.title }</h1>
    );
};

export default forwardRef(Heading);
