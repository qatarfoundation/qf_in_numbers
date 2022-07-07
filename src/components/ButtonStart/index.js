// React
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

function ButtonStart(props, ref) {
    /**
     * States
     */

    /**
     * Refs
     */
    const elRef = useRef();
    const circleRef = useRef();
    const labelRef = useRef();
    const labelCloneRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
        mouseenter: null,
        mouseleave: null,
    });

    const isTransitioning = useRef(false);
    const isHovering = useRef(false);
    const isHoverAllowed = useRef(false);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {

    }

    function destroy() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();

        timelines.current.mouseenter?.kill();
        timelines.current.mouseleave?.kill();
    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline({ onComplete: showCompletedHandler });
        timelines.current.show.call(() => { isTransitioning.current = true; }, 0);
        timelines.current.show.fromTo(circleRef.current, { scale: 0.5 }, { duration: 1.5, scale: 1, ease: 'power4.out' }, 0);
        timelines.current.show.to(circleRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.show.to(labelRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0.5);
        timelines.current.show.fromTo(labelRef.current, { y: '50%' }, { duration: 1, y: 0, ease: 'power3.out' }, 0.5);
        timelines.current.show.call(() => { isTransitioning.current = false; });
        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.call(() => { isTransitioning.current = true; }, 0);
        timelines.current.hide.to(elRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' });
        return timelines.current.hide;
    }

    /**
     * Private
     */
    function mouseenter() {
        timelines.current.mouseleave?.kill();

        timelines.current.mouseenter = new gsap.timeline();

        timelines.current.mouseenter.timeScale(1.2);

        timelines.current.mouseenter.fromTo(labelRef.current, { y: '0%' }, { duration: 1, y: '-100%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(labelRef.current, { alpha: 1 }, { duration: 0.8, alpha: 0, ease: 'power3.out' }, 0);

        timelines.current.mouseenter.fromTo(labelCloneRef.current, { y: '100%' }, { duration: 1, y: '0%', ease: 'power3.out' }, 0.1);
        timelines.current.mouseenter.fromTo(labelCloneRef.current, { alpha: 0 }, { duration: 0.8, alpha: 1, ease: 'power3.out' }, 0.1);

        timelines.current.mouseenter.set(labelRef.current, { y: '0%', alpha: 1 });
        timelines.current.mouseenter.set(labelCloneRef.current, { y: '0%', alpha: 0 });

        timelines.current.mouseenter.to(circleRef.current, { duration: 0.8, scale: 1.1, ease: 'power3.out' }, 0);

        timelines.current.mouseenter.call(mouseenterCompleteHandler, null, 0.8);
    }

    function mouseleave() {
        timelines.current.mouseenter?.kill();

        timelines.current.mouseleave = new gsap.timeline();

        timelines.current.mouseleave.timeScale(1.2);

        timelines.current.mouseleave.set(labelRef.current, { y: '0%', alpha: 1 });
        timelines.current.mouseleave.set(labelCloneRef.current, { y: '0%', alpha: 0 });

        timelines.current.mouseleave.to(circleRef.current, { duration: 0.8, scale: 1, ease: 'power3.out' }, 0);

        timelines.current.mouseleave.call(mouseleaveCompleteHandler, null, 0.5);
    }

    /**
     * Handlers
     */
    function showCompletedHandler() {
        isHoverAllowed.current = true;

        elRef.current.style.pointerEvents = 'all';
    }

    function mouseenterHandler() {
        isHovering.current = true;
        if (!isHoverAllowed.current || isTransitioning.current) return;

        isHoverAllowed.current = false;
        mouseenter();
    }

    function mouseleaveHandler() {
        isHovering.current = false;
        if (!isHoverAllowed.current || isTransitioning.current) return;

        isHoverAllowed.current = false;
        mouseleave();
    }

    function mouseenterCompleteHandler() {
        isHoverAllowed.current = true;

        if (!isHovering.current) {
            mouseleaveHandler();
        }
    }

    function mouseleaveCompleteHandler() {
        isHoverAllowed.current = true;

        if (isHovering.current) {
            mouseenterHandler();
        }
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    return (
        <Link to={ props.to } ref={ elRef } className="button button-start" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>
            <div ref={ circleRef } className="circle"></div>
            <div className="label-container">
                <span ref={ labelRef } className="label">{ props.label }</span>
                <span ref={ labelCloneRef } className="label clone">{ props.label }</span>
            </div>
        </Link>
    );
}

export default forwardRef(ButtonStart);
