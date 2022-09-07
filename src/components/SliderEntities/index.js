// React
import React, { useEffect, useRef, forwardRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { usePresence } from 'framer-motion';

// Vendor
import { gsap } from 'gsap';

// Utils
import math from '@/utils/math/index';
import Globals from '@/utils/Globals';

// CSS
import './style.scoped.scss';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import SlideEntity from '../SlideEntity';
import useTick from '@/hooks/useTick';

function SliderEntities(props) {
    /**
     * Props
     */
    const { category, subcategory, currentIndex } = props;
    const entities = subcategory.entities;

    /**
     * Data
     */
    const { language } = useI18next();

    /**
     * Refs
     */
    const listEntitiesRef = useRef();
    const listItemEntitiesRef = useRef([]);

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
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Watchers
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut();
    }, [isPresent]);

    useEffect(() => {
        Globals.webglApp.gotoEntity(category.id, entities[currentIndex].id);
        updateTargetOffset();
    }, [currentIndex]);

    useEffect(() => {
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
    }

    function destroy() {
        timelines.current.transitionIn?.kill();
        timelines.current.transitionOut?.kill();
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
            offset.current.target += -bounds.current.listItems[i];
        }
    }

    function resize() {
        getBounds();
        updateTargetOffset();
    }

    function getBounds() {
        if (!listItemEntitiesRef.current[0]) return;

        bounds.current.listItems = [];

        let first = null;

        for (let i = 0; i < listItemEntitiesRef.current.length; i++) {
            const listItem = listItemEntitiesRef.current[i];
            const child = listItem.children[0];
            if (child.classList.contains('first')) {
                child.classList.remove('first');
                first = child;
            }
            bounds.current.listItems.push(listItem.offsetHeight);
        }

        if (first) first.classList.add('first');
    }

    function updateOffset() {
        offset.current.current = math.lerp(offset.current.current, offset.current.target, 0.1);
    }

    // TODO: update position outside of ticker
    function updateListItemPosition() {
        if (!listItemEntitiesRef.current[0]) return;

        for (let i = 0; i < listItemEntitiesRef.current.length; i++) {
            listItemEntitiesRef.current[i].style.transform = `translate3d(0, ${ offset.current.current }px, 0)`;
        }
    }

    /**
     * Events
     */
    useTick(tickHandler);
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
                                    <SlideEntity entity={ entity } goto={ props.goto } index={ index } activeIndex={ index - currentIndex } />
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
