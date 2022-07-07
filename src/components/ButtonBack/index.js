// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonBack(props, ref) {
    /**
     * Datas
     */
    const { name, slug } = props;
    const { language } = useI18next();

    /**
     * Refs
     */
    const elRef = useRef();

    const arrowContainerInitRef = useRef();
    const arrowContainerHoverRef = useRef();

    const textInitRef = useRef();
    const textHoverRef = useRef();

    const circleRef = useRef();

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
        show();
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
        const direction = language === 'ar-QA' ? -1 : 1;

        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();

        timelines.current.show.set(elRef.current, { autoAlpha: 1 }, 0);

        timelines.current.show.fromTo(circleRef.current, { scale: 0 }, { duration: 1, scale: 1, ease: 'power3.out' }, 0);
        timelines.current.show.fromTo(circleRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);

        timelines.current.show.fromTo(arrowContainerInitRef.current, { x: `${ 100 * direction }%` }, { duration: 1, x: '0%', ease: 'power3.out' }, 0.1);
        timelines.current.show.fromTo(arrowContainerInitRef.current, { alpha: 0 }, { duration: 0.8, alpha: 1, ease: 'sine.inOut' }, 0.1);

        timelines.current.show.fromTo(textInitRef.current, { y: `${ 70 }%` }, { duration: 1, y: '0%', ease: 'power4.out' }, 0.5);
        timelines.current.show.fromTo(textInitRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.5);

        timelines.current.show.call(showCompletedHandler, null, 1);

        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();

        timelines.current.hide.to(elRef.current, { duration: 0.5, autoAlpha: 0, ease: 'sine.inOut' }, 0);

        return timelines.current.hide;
    }

    /**
     * Private
     */
    function mouseenter() {
        timelines.current.show?.kill();
        timelines.current.mouseleave?.kill();

        timelines.current.mouseenter = new gsap.timeline();

        // Text
        timelines.current.mouseenter.fromTo(textInitRef.current, { y: '0%' }, { duration: 0.7, y: '-60%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(textInitRef.current, { alpha: 1 }, { duration: 0.3, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseenter.fromTo(textHoverRef.current, { y: '60%' }, { duration: 0.8, y: '0%', ease: 'power3.out' }, 0.2);
        timelines.current.mouseenter.fromTo(textHoverRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.2);

        // Arrow
        timelines.current.mouseenter.fromTo(arrowContainerInitRef.current, { x: '0%' }, { duration: 1, x: '-100%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(arrowContainerInitRef.current, { alpha: 1 }, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseenter.fromTo(arrowContainerHoverRef.current, { x: '100%' }, { duration: 1, x: '0%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.fromTo(arrowContainerHoverRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);

        timelines.current.mouseenter.call(mouseenterCompleteHandler, null, 0.8);
    }

    function mouseleave() {
        timelines.current.show?.kill();
        timelines.current.mouseenter?.kill();

        timelines.current.mouseleave = new gsap.timeline();

        // Text
        timelines.current.mouseleave.fromTo(textHoverRef.current, { y: '0%' }, { duration: 0.7, y: '-60%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.fromTo(textHoverRef.current, { alpha: 1 }, { duration: 0.3, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseleave.fromTo(textInitRef.current, { y: '60%' }, { duration: 0.8, y: '0%', ease: 'power3.out' }, 0.2);
        timelines.current.mouseleave.fromTo(textInitRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.2);

        // Arrow
        timelines.current.mouseleave.fromTo(arrowContainerHoverRef.current, { x: '0%' }, { duration: 1, x: '-100%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.fromTo(arrowContainerHoverRef.current, { alpha: 1 }, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);

        timelines.current.mouseleave.fromTo(arrowContainerInitRef.current, { x: '100%' }, { duration: 1, x: '0%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.fromTo(arrowContainerInitRef.current, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);

        timelines.current.mouseleave.call(mouseleaveCompleteHandler, null, 0.8);
    }

    /**
     * Handlers
     */
    function showCompletedHandler() {
        // Enable hover
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
        <Link ref={ elRef } to={ slug ? slug : '' } { ...props } className={ `button button-back ${ props.className ? props.className : '' }` } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>

            <div className="icon icon-arrow">

                <div ref={ arrowContainerInitRef } className="arrow-container arrow-container-init">
                    <Arrow className={ 'arrow arrow-init' } />
                </div>

                <div ref={ arrowContainerHoverRef } className="arrow-container arrow-container-hover">
                    <Arrow className={ 'arrow arrow-hover' } />
                </div>

                <div ref={ circleRef } className="circle"></div>

            </div>

            <p className='p3'>
                <span ref={ textInitRef } className="text text-init">{ name }</span>
                <span ref={ textHoverRef } className="text text-hover">{ name }</span>
            </p>

        </Link>
    );
}

export default forwardRef(ButtonBack);
