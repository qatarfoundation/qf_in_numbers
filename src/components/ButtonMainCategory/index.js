// React
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// Vendor
import gsap from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
gsap.registerPlugin(SplitText);

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';

const ButtonMainCategory = (props) => {
    /**
     * Data
     */
    const { t } = useTranslation();

    /**
     * Refs
     */
    const el = useRef();
    const titleRef = useRef();
    const circleRef = useRef();
    const coloredCircleRef = useRef();
    const dotRef = useRef();
    const labelRef = useRef();

    const timelines = useRef({
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

    function mounted() {
        setupEventListeners();
    }

    function destroy() {
        removeEventListeners();
    }

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
    function anchorPositionChangedHandler(position) {
        el.current.style.transform = `translate(${ position.x }px, ${ position.y }px)`;
    }

    function mouseenterHandler() {
        timelines.current.mouseleave?.kill();

        timelines.current.mouseenter = new gsap.timeline();
        timelines.current.mouseenter.to(labelRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.mouseenter.to(coloredCircleRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.mouseenter.to(circleRef.current, { duration: 1, scale: 0.55, ease: 'power3.out' }, 0);
        timelines.current.mouseenter.to(circleRef.current, { duration: 1, y: '-50%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.to(dotRef.current, { duration: 1, y: '-50%', ease: 'power3.out' }, 0);
        timelines.current.mouseenter.to(dotRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.3);
    }

    function mouseleaveHandler() {
        timelines.current.mouseenter?.kill();

        timelines.current.mouseleave = new gsap.timeline();
        timelines.current.mouseleave.to(labelRef.current, { duration: 0.2, alpha: 0, ease: 'sine.inOut' }, 0);
        timelines.current.mouseleave.to(coloredCircleRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
        timelines.current.mouseleave.to(dotRef.current, { duration: 0.2, alpha: 0, ease: 'sine.inOut' }, 0);
        timelines.current.mouseleave.to(circleRef.current, { duration: 1, scale: 1, ease: 'power3.out' }, 0);
        timelines.current.mouseleave.to(circleRef.current, { duration: 1, y: '0%', ease: 'power3.out' }, 0);
        timelines.current.mouseleave.to(dotRef.current, { duration: 1, y: '0%', ease: 'power3.out' }, 0);
    }

    return (
        <div className={ `button-main-category anchor-${ props.anchorX } ${ props.color }` } ref={ el } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>

            <div className="click-area copy h4">{ props.label }</div>

            <div className="content">

                <p ref={ titleRef } className="copy h4">{ props.label }</p>

                <div className="circle-container">

                    <div ref={ circleRef } className="circle">

                        <div ref={ coloredCircleRef } className="colored-circle"></div>

                    </div>

                    <div ref={ dotRef } className="dot"></div>

                </div>

                <p ref={ labelRef } className='label p3'>{ t('Click to discover') }</p>

            </div>

        </div>
    );
};

export default ButtonMainCategory;
