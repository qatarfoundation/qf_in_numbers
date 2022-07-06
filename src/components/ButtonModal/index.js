// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

function ButtonModal(props, ref) {
    /**
     * Refs
     */
    const elRef = useRef();

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
        timelines.current.show.to(elRef.current, { duration: 1, autoAlpha: 1, ease: 'sine.inOut' }, 0);
        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 1, autoAlpha: 0, ease: 'sine.inOut' }, 0);
        return timelines.current.hide;
    }

    /**
     * Private
     */
    function mouseenter() {
        timelines.current.mouseleave?.kill();

        timelines.current.mouseenter = new gsap.timeline();

        timelines.current.mouseenter.call(mouseenterCompleteHandler, null, 0.8);
    }

    function mouseleave() {
        timelines.current.mouseenter?.kill();

        timelines.current.mouseleave = new gsap.timeline();

        timelines.current.mouseleave.call(mouseleaveCompleteHandler, null, 0.5);
    }

    /**
     * Handlers
     */
    function showCompletedHandler() {
        isHoverAllowed.current = true;
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
        <button ref={ elRef } onClick={ props.onClick } className="button button-modal heading-dropdown" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>

            <span className='text text-init'>{ props.name }</span>
            <span className='text text-hover'>{ props.name }</span>
            <span className='arrow arrow-init' />
            <span className='arrow arrow-hover' />
            <span className='line line-init' />
            <span className='line line-hover' />

        </button>
    );
}

export default forwardRef(ButtonModal);
