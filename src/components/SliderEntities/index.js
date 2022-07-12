// React
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { usePresence } from 'framer-motion';

// Vendor
import { gsap } from 'gsap';

// Utils
import math from '@/utils/math/index';
import number from '@/utils/number/index';

// CSS
import './style.scoped.scss';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import SlideEntity from '../SlideEntity/index';

function SliderEntities(props, ref) {
    /**
     * Props
     */
    const { category, subcategory } = props;
    const subcategoryIndex = category.subcategories.map((item) => item.id).indexOf(subcategory.id);
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
    const sliderContentRef = useRef();

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
    const [currentIndex, setCurrentIndex] = useState(0);
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
        timelines.current.transitionIn.to(sliderContentRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' });
        timelines.current.transitionIn.call(() => { transitionInCompleted(); }, null);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline();
        timelines.current.transitionOut.to(sliderContentRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' });
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
        bounds.current.listItems = [];

        for (let i = 0; i < listItemEntitiesRef.current.length; i++) {
            const listItem = listItemEntitiesRef.current[i];
            bounds.current.listItems.push(listItem.offsetHeight);
        }
    }

    function updateOffset() {
        offset.current.current = math.lerp(offset.current.current, offset.current.target, 0.1);
    }

    function updateListItemPosition() {
        for (let i = 0; i < listItemEntitiesRef.current.length; i++) {
            const listItem = listItemEntitiesRef.current[i];
            listItem.style.transform = `translateY(${ offset.current.current }px)`;
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

    function clickTopHandler() {
        if (currentIndex === 0) return;

        const targetIndex = number.modulo(currentIndex - 1, entities.length);

        setCurrentIndex(targetIndex);
    }

    function clickBottomHandler() {
        if (currentIndex === entities.length - 1) return;

        const targetIndex = number.modulo(currentIndex + 1, entities.length);

        setCurrentIndex(targetIndex);
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

    /**
     * Utils
     */
    function romanize(num) {
        if (isNaN(num)) return NaN;
        const digits = String(+num).split('');
        const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        let roman = '';
        let i = 3;
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || '') + roman;
        }
        return Array(+digits.join('') + 1).join('M') + roman;
    }

    return (
        <>
            <div className="slider-entities">

                { /* Navigation */ }
                <div className="slider-navigation">
                    <button className={ 'button button-navigation button-navigation-top' } disabled={ currentIndex === 0 } onClick={ clickTopHandler }></button>
                    <button className={ 'button button-navigation button-navigation-bottom' } disabled={ currentIndex === entities.length - 1 } onClick={ clickBottomHandler }></button>
                </div>

                { /* Content */ }
                <div ref={ sliderContentRef } className="slider-content">

                    <p className="slider-subcategory-title h3">{ romanize(subcategoryIndex + 1) }. { subcategory.name }</p>

                    <ul className="list-entities" ref={ listEntitiesRef }>
                        { entities.map((entity, index) => {
                            return (
                                <li key={ `entity-${ index }` } className={ 'item-entities' } ref={ el => listItemEntitiesRef.current[index] = el }>
                                    <SlideEntity entity={ entity } index={ index - currentIndex } />
                                </li>
                            );
                        }) }
                    </ul>

                </div>

            </div>
        </>
    );
}

export default forwardRef(SliderEntities);
