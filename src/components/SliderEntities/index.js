// React
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

function SliderEntities(props, ref) {
    /**
     * Props
     */
    const { category, subcategory } = props;
    const entities = subcategory.entities;

    /**
     * Refs
     */
    const entitiesTitlesRef = useRef([]);
    const listEntitiesRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
    });

    /**
     * States
     */
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);
    const [currentIndex, setCurrentIndex] = useState(0);

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
    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();

        timelines.current.show = new gsap.timeline();
        return timelines.current.show;
    }

    function hide() {
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
     * Private
     */
    function resize() {
        setBreakpoints(Breakpoints.current);
    }

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    function clickTopHandler() {

    }

    function clickBottomHandler() {

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
                    { breakpoints != 'small' && <button className={ 'button button-navigation button-navigation-top' } onClick={ clickTopHandler }></button> }
                    { breakpoints != 'small' && <button className={ 'button button-navigation button-navigation-bottom' } onClick={ clickBottomHandler }></button> }
                </div>

                { /* Content */ }
                <div className="slider-content">

                    <p className="slider-subcategory-title h3">{ romanize(currentIndex + 1) }. { category.subcategories[currentIndex].name }</p>

                    {
                        breakpoints == 'small' ?

                            <ul className="list-entities">
                                { entities.map((entity, index) => {
                                    return (<li key={ `entity-${ index }` } className={ `item-entities ${ index == currentIndex ? 'is-active' : '' }` }>
                                        <p className="slider-entity-title p1">{ index + 1 }</p>
                                    </li>);
                                }) }
                            </ul>
                            :
                            <ul className="list-entities" ref={ listEntitiesRef }>
                                { entities.map((entity, index) => {
                                    return (
                                        <li key={ `entity-${ index }` } className={ `item-entities ${ index == currentIndex ? 'is-active' : '' }` } ref={ el => entitiesTitlesRef.current[index] = el }>
                                            <p className="slider-entity-title p1" activeindex={ index }>{ entity.name }</p>
                                        </li>
                                    );
                                }) }
                            </ul>
                    }

                </div>

            </div>
        </>
    );
}

export default forwardRef(SliderEntities);
