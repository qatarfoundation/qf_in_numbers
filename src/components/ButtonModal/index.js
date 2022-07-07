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

    const textInitRef = useRef();
    const textHoverRef = useRef();

    const arrowInitRef = useRef();
    const arrowHoverRef = useRef();

    const lineInitRef = useRef();
    const lineHoverRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
        mouseenter: null,
        mouseleave: null,
    });

    const isTransitioning = useRef(false);
    const isHovering = useRef(false);
    const isHoverAllowed = useRef(true);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        // Debug
        // show();
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
        timelines.current.show = new gsap.timeline();

        timelines.current.show.to(elRef.current, { duration: 1, autoAlpha: 1, ease: 'sine.inOut' }, 0);

        // Line
        timelines.current.show.fromTo(lineInitRef.current, { scaleX: 0, transformOrigin: 'left bottom' }, { duration: 1, scaleX: 1, ease: 'power3.out' }, 0);

        // Text
        timelines.current.show.fromTo(textInitRef.current, { y: '100%' }, { duration: 1.2, y: '0%', ease: 'power3.out' }, 0.1);
        timelines.current.show.fromTo(textInitRef.current, { alpha: 0 }, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0.2);

        // Arrow
        timelines.current.show.fromTo(arrowInitRef.current, { y: '300%' }, { duration: 1.5, y: '0%', ease: 'power3.out' }, 0.5);
        timelines.current.show.fromTo(arrowInitRef.current, { alpha: 0 }, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0.5);

        timelines.current.show.call(showCompletedHandler, null, 1);

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
        timelines.current.show?.kill();
        timelines.current.mouseleave?.kill();

        timelines.current.mouseenter = new gsap.timeline();

        // Line
        timelines.current.mouseenter.fromTo(lineHoverRef.current, { transformOrigin: 'left bottom', scaleX: 0 }, { duration: 0.5, scaleX: 1, ease: 'power3.out' }, 0);

        // Text
        timelines.current.mouseenter.fromTo(textInitRef.current, { y: '0%' }, { duration: 0.7, y: '-60%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(textInitRef.current, { alpha: 1 }, { duration: 0.3, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseenter.fromTo(textHoverRef.current, { y: '60%' }, { duration: 0.8, y: '0%', ease: 'power3.out' }, 0.2);
        timelines.current.mouseenter.fromTo(textHoverRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.2);

        // Arrow
        timelines.current.mouseenter.fromTo(arrowInitRef.current, { y: '0%' }, { duration: 0.5, y: '300%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(arrowInitRef.current, { alpha: 1 }, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseenter.fromTo(arrowHoverRef.current, { y: '-300%' }, { duration: 0.5, y: '0%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(arrowHoverRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);

        timelines.current.mouseenter.call(mouseenterCompleteHandler, null, 1);
    }

    function mouseleave() {
        timelines.current.show?.kill();
        timelines.current.mouseenter?.kill();

        timelines.current.mouseleave = new gsap.timeline();

        // Line
        timelines.current.mouseleave.fromTo(lineHoverRef.current, { transformOrigin: 'right bottom', scaleX: 1 }, { duration: 0.5, scaleX: 0, ease: 'power3.inOut' }, 0);

        // Text
        timelines.current.mouseleave.fromTo(textHoverRef.current, { y: '0%' }, { duration: 0.7, y: '-60%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.fromTo(textHoverRef.current, { alpha: 1 }, { duration: 0.3, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseleave.fromTo(textInitRef.current, { y: '60%' }, { duration: 0.8, y: '0%', ease: 'power3.out' }, 0.2);
        timelines.current.mouseleave.fromTo(textInitRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.2);

        // Arrow
        timelines.current.mouseleave.fromTo(arrowHoverRef.current, { y: '0%' }, { duration: 0.5, y: '300%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.fromTo(arrowHoverRef.current, { alpha: 1 }, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseleave.fromTo(arrowInitRef.current, { y: '-300%' }, { duration: 0.5, y: '0%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.fromTo(arrowInitRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);

        timelines.current.mouseleave.call(mouseleaveCompleteHandler, null, 1);
    }

    /**
     * Handlers
     */
    function showCompletedHandler() {
        // Enable hover
        elRef.current.style.pointerEvent = 'all';
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

            <span ref={ textInitRef } className='text text-init'>{ props.name }</span>
            <span ref={ textHoverRef } className='text text-hover'>{ props.name }</span>

            <span ref={ arrowInitRef } className='arrow arrow-init' />
            <span ref={ arrowHoverRef }className='arrow arrow-hover' />

            <span ref={ lineInitRef } className='line line-init' />
            <span ref={ lineHoverRef } className='line line-hover' />

        </button>
    );
}

export default forwardRef(ButtonModal);
