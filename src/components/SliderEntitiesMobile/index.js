// React
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { usePresence } from 'framer-motion';

// Vendor
import { gsap } from 'gsap';

// Utils
import math from '@/utils/math/index';

// CSS
import './style.scoped.scss';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import SlideEntityMobile from '../SlideEntityMobile/index';

function SliderEntities(props, ref) {
    /**
     * Props
     */
    const { subcategory, currentIndex } = props;
    const entities = subcategory.entities;

    /**
     * Data
     */
    const { language } = useI18next();

    /**
     * Refs
     */
    const listItemEntitiesRef = useRef([]);
    const listEntitiesRef = useRef();

    const timelines = useRef({
        transitionIn: null,
        transitionOut: null,
    });

    const bounds = useRef({
        listItems: [],
    });

    const offset = useRef({
        current: 0,
        target: 0,
    });

    /**
     * States
     */
    const [direction, setDirection] = useState();
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Watchers
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut();
    }, [isPresent]);

    useEffect(() => {
        updateTargetOffset();
    }, [currentIndex]);

    useEffect(() => {
        setDirection(language === 'ar-QA' ? 1 : -1);
        getBounds();
        updateTargetOffset();
    }, [language]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        getBounds();
        updateTargetOffset();
        offset.current.current = offset.current.target;
        setupEventListeners();
    }

    function destroy() {
        timelines.current.transitionIn?.kill();
        timelines.current.transitionOut?.kill();
        removeEventListeners();
    }

    /**
     * Private
     */
    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline();
        timelines.current.transitionIn.to(listEntitiesRef.current, { duration: 0.4, alpha: 1, ease: 'sine.inOut' });
        timelines.current.transitionIn.call(() => { transitionInCompleted(); }, null);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline();
        timelines.current.transitionOut.to(listEntitiesRef.current, { duration: 0.4, alpha: 0, ease: 'sine.inOut' });
        timelines.current.transitionOut.call(() => { transitionOutCompleted(); }, null);
    }

    function updateTargetOffset() {
        offset.current.target = 0;
        for (let i = 0; i < currentIndex; i++) {
            offset.current.target += bounds.current.listItems[i] * direction;
        }
    }

    function resize() {
        getBounds();
        updateTargetOffset();
    }

    function getBounds() {
        bounds.current.listItems = [];

        for (let i = 0; i < listItemEntitiesRef.current.length; i++) {
            const listItem = listItemEntitiesRef.current[i];
            bounds.current.listItems.push(listItem.offsetWidth);
        }
    }

    function updateOffset() {
        offset.current.current = math.lerp(offset.current.current, offset.current.target, 0.1);
    }

    function updateListItemPosition() {
        for (let i = 0; i < listItemEntitiesRef.current.length; i++) {
            const listItem = listItemEntitiesRef.current[i];
            listItem.style.transform = `translateX(${ offset.current.current }px)`;
        }
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

    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    function tickHandler() {
        updateOffset();
        updateListItemPosition();
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        safeToRemove();
    }

    return (
        <>
            <div className="slider-entities">

                <ul className="list-entities" ref={ listEntitiesRef }>

                    {
                        entities.map((entity, index) => {
                            return (
                                <li key={ `entity-${ index }` } className={ 'item-entities' } ref={ el => listItemEntitiesRef.current[index] = el }>
                                    <SlideEntityMobile entity={ entity } index={ index - currentIndex } />
                                </li>
                            );
                        })
                    }

                </ul>

            </div>
        </>
    );
}

export default forwardRef(SliderEntities);
