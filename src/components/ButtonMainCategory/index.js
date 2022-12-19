// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation, Link } from 'gatsby-plugin-react-i18next';

// Vendor
import gsap from 'gsap';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';
import BranchHover from '@/utils/BranchHover';

// CSS
import './style.scoped.scss';

const ButtonMainCategory = (props, ref) => {
    /**
     * Props
     */
    const { isNotActive, categoryId } = props;

    /**
     * Data
     */
    const { t } = useTranslation();

    /**
     * Refs
     */
    const elRef = useRef();
    const titleRef = useRef();
    const circleContainerRef = useRef();
    const circleRef = useRef();
    const coloredCircleRef = useRef();
    const dotRef = useRef();
    const labelRef = useRef();
    const mouseLeaveTimeout = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
        mouseenter: null,
        mouseleave: null,
    });

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    useEffect(() => {
        const mouseEnterHandler = function(id) {
            timelines.current.fadeIn?.kill();

            if (id === categoryId) {
                timelines.current.mouseleave?.kill();

                timelines.current.mouseenter = new gsap.timeline();
                timelines.current.mouseenter.to(coloredCircleRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
                timelines.current.mouseenter.to(circleRef.current, { duration: 1, scale: 0.55, ease: 'power3.out' }, 0);
                timelines.current.mouseenter.to(circleRef.current, { duration: 1, y: props.anchorY === 'top' ? '-48%' : '36%', ease: 'power3.out' }, 0);
                timelines.current.mouseenter.to(dotRef.current, { duration: 1, y: props.anchorY === 'top' ? '-48%' : '36%', ease: 'power3.out' }, 0);
                timelines.current.mouseenter.to(labelRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
                timelines.current.mouseenter.to(dotRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
            } else {
                timelines.current.fadeOut = new gsap.timeline();
                timelines.current.fadeOut.to(elRef.current, { duration: 0.5, alpha: 0.5, ease: 'sine.inOut' }, 0);
            }
        };

        const mouseLeaveHandler = function(id) {
            if (id === categoryId) {
                timelines.current.mouseenter?.kill();

                timelines.current.mouseleave = new gsap.timeline();
                timelines.current.mouseleave.to(labelRef.current, { duration: 0.2, alpha: 0, ease: 'sine.inOut' }, 0);
                timelines.current.mouseleave.to(coloredCircleRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
                timelines.current.mouseleave.to(dotRef.current, { duration: 0.2, alpha: 0, ease: 'sine.inOut' }, 0);
                timelines.current.mouseleave.to(circleRef.current, { duration: 1, scale: 1, ease: 'power3.out' }, 0);
                timelines.current.mouseleave.to(circleRef.current, { duration: 1, y: '0%', ease: 'power3.out' }, 0);
                timelines.current.mouseleave.to(dotRef.current, { duration: 1, y: '0%', ease: 'power3.out' }, 0);
            }

            // timelines.current.fadeOut?.kill();
            // timelines.current.fadeIn = new gsap.timeline();
            // timelines.current.fadeIn.to(elRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
        };

        BranchHover[categoryId].addEventListener('mouseEnter', mouseEnterHandler);
        BranchHover[categoryId].addEventListener('mouseLeave', mouseLeaveHandler);

        return () => {
            BranchHover[categoryId].removeEventListener('mouseEnter', mouseEnterHandler);
            BranchHover[categoryId].removeEventListener('mouseLeave', mouseLeaveHandler);
        };
    }, []);

    function mounted() {
        setupEventListeners();
    }

    function destroy() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
        timelines.current.mouseenter?.kill();
        timelines.current.mouseleave?.kill();

        removeEventListeners();
    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();

        timelines.current.show = new gsap.timeline();

        timelines.current.show.to(titleRef.current, { duration: 1.5, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.show.to(titleRef.current, { duration: 2, rotation: '0deg', ease: 'power4.out' }, 0);
        timelines.current.show.to(titleRef.current, { duration: 2, y: '0%', ease: 'power4.out' }, 0);

        timelines.current.show.to(circleContainerRef.current, { duration: 1.5, alpha: 1, ease: 'sine.inOut' }, 0.1);
        timelines.current.show.to(circleContainerRef.current, { duration: 2, scale: 1, ease: 'power4.out' }, 0.2);

        timelines.current.show.call(showCompletedHandler, null, 1);

        return timelines.current.show;
    }

    function hide() {
        timelines.current.mouseenter?.kill();
        timelines.current.mouseleave?.kill();

        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();

        return timelines.current.hide;
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    /**
     * Events
     */
    function setupEventListeners() {
        TreeDataModel.addEventListener(`category/${ props.index }/label/position`, anchorPositionChangedHandler);
    }

    function removeEventListeners() {
        TreeDataModel.removeEventListener(`category/${ props.index }/label/position`, anchorPositionChangedHandler);
    }

    /**
     * Handlers
     */
    function showCompletedHandler() {
        // Enable hover
        elRef.current.style.pointerEvents = 'all';
    }

    function anchorPositionChangedHandler(position) {
        elRef.current.style.transform = `translate(${ position.x }px, ${ position.y }px)`;
    }

    function mouseenterHandler() {
        BranchHover[categoryId].mouseEnter(categoryId);
    }

    function mouseleaveHandler() {
        BranchHover[categoryId].mouseLeave(categoryId);
    }

    return (
        <Link to={ props.slug && !isNotActive ? props.slug : '' } className={ `button-main-category anchor-x-${ props.anchorX } anchor-y-${ props.anchorY } ${ props.color } ${ isNotActive ? 'is-not-active' : '' }` } ref={ elRef } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>

            <div className="click-area copy h4">{ props.label }</div>

            <div className="content">

                <p ref={ titleRef } className="title copy h4">{ props.label }</p>

                <div ref={ circleContainerRef } className="circle-container">

                    <div ref={ circleRef } className="circle">

                        <div ref={ coloredCircleRef } className="colored-circle"></div>

                    </div>

                    <div ref={ dotRef } className="dot"></div>

                </div>

                <p ref={ labelRef } className='label p3'>{ t('Click to discover') }</p>

            </div>

        </Link>
    );
};

export default forwardRef(ButtonMainCategory);
