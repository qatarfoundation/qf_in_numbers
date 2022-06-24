// React
import React, { useState, useEffect, useRef } from 'react';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useStore from '@/hooks/useStore';

// Components
import ModalSubcategories from '@/components/ModalSubcategories';

function SliderEntities(props) {
    /**
     * Store
     */
    const [indexActiveSubcategory, indexActiveEntity] = useStore((state) => [
        state.indexActiveSubcategory,
        state.indexActiveEntity,
    ]);

    /**
     * Props
     */
    const { category } = props;
    const entities = category.subcategories[indexActiveSubcategory].entities || [];

    /**
     * Refs
     */
    const entitiesTitles = useRef([]);
    const listEntities = useRef();

    /**
     * States
     */
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);
    const [activeSubcategoryNumeral, setActiveSubcategoryNumeral] = useState(null);
    const [activeIndexOffset, setActiveIndexOffset] = useState(0);
    const [entitiesTitleHeight, setEntitiesTitleHeight] = useState([]);

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
     * Effects
     */
    useEffect(() => {
        setActiveIndexOffset(-indexActiveEntity);
        resize();
    }, [entities]);

    useEffect(() => {
        const roman = romanize(indexActiveSubcategory + 1);
        setActiveSubcategoryNumeral(roman);
    }, [indexActiveSubcategory]);

    /**
     * Functions
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

    function clickHandlerTop() {
        const newIndexActiveEntity = indexActiveEntity - 1;
        if (newIndexActiveEntity >= 0) {
            useStore.setState({ indexActiveEntity: newIndexActiveEntity });

            const offset = entitiesTitleHeight[newIndexActiveEntity];
            gsap.to(listEntities.current, { duration: 1, y: -offset, ease: 'power1.inOut' });
            gsap.delayedCall(0.8, () => {
                setActiveIndexOffset(-newIndexActiveEntity);
            });
        } else {
            const newIndexActiveSubcategory = indexActiveSubcategory - 1;
            if (newIndexActiveSubcategory >= 0) {
                useStore.setState({ indexActiveEntity: category.subcategories[newIndexActiveSubcategory].entities.length - 1 });
                useStore.setState({ indexActiveSubcategory: newIndexActiveSubcategory });

                gsap.killTweensOf(listEntities.current);
            }
        }
    }

    function clickHandlerBottom() {
        const newIndexActiveEntity = indexActiveEntity + 1;
        const lengthEntities = category.subcategories[indexActiveSubcategory].entities.length - 1;
        if (newIndexActiveEntity <= lengthEntities) {
            useStore.setState({ indexActiveEntity: newIndexActiveEntity });

            setActiveIndexOffset(-newIndexActiveEntity);
            const offset = entitiesTitleHeight[newIndexActiveEntity];
            gsap.to(listEntities.current, { duration: 1, y: -offset, delay: 0.2, ease: 'power1.inOut' });
        } else {
            const newIndexActiveSubcategory = indexActiveSubcategory + 1;
            const lengthSubcategories = category.subcategories.length - 1;
            if (newIndexActiveSubcategory <= lengthSubcategories) {
                useStore.setState({ indexActiveEntity: 0 });
                useStore.setState({ indexActiveSubcategory: newIndexActiveSubcategory });

                gsap.killTweensOf(listEntities.current);
            }
        }
    }

    /**
     * Resize
     */
    function resize() {
        setBreakpoints(Breakpoints.current);
        const heights = calcEntitiesTitleHeight();
        setListOffset(heights);
    }

    function calcEntitiesTitleHeight() {
        const entitiesTitleHeight = [];
        const elements = entitiesTitles.current;
        let totalHeight = 0;
        elements.forEach((element) => {
            if (element) {
                entitiesTitleHeight.push(totalHeight);
                totalHeight += element.offsetHeight;
            }
        });
        setEntitiesTitleHeight(entitiesTitleHeight);
        return entitiesTitleHeight;
    }

    function setListOffset(heights) {
        const offset = heights[indexActiveEntity];
        gsap.set(listEntities.current, { y: -offset });
    }

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    return (
        <>
            <div className="slider-entities">

                { /* Navigation */ }
                <div className="slider-navigation">
                    { breakpoints != 'small' && <button className={ `button button-navigation button-navigation-top ${ indexActiveSubcategory == 0 && indexActiveEntity == 0 ? 'is-inactive' : '' }` } onClick={ clickHandlerTop }></button> }
                    { breakpoints != 'small' && <button className={ `button button-navigation button-navigation-bottom ${ indexActiveSubcategory == category.subcategories.length - 1 && indexActiveEntity == category.subcategories[indexActiveSubcategory].entities.length - 1 ? 'is-inactive' : '' }` } onClick={ clickHandlerBottom }></button> }
                    <ModalSubcategories subcategories={ category.subcategories } />
                </div>

                { /* Content */ }
                <div className="slider-content">
                    <p className="slider-subcategory-title h3">{ activeSubcategoryNumeral }. { category.subcategories[indexActiveSubcategory].name }</p>
                    { breakpoints == 'small' ?
                        <ul className="list-entities">
                            { entities.map((entity, index) => {
                                return (<li key={ `entity-${ index }` } className={ `item-entities ${ index == indexActiveEntity ? 'is-active' : '' }` }>
                                    <p className="slider-entity-title p1">{ index + 1 }</p>
                                </li>);
                            }) }
                        </ul>
                        :
                        <ul className="list-entities" ref={ listEntities }>
                            { entities.map((entity, index) => {
                                return (
                                    <li key={ `entity-${ index }` } className={ `item-entities ${ index == indexActiveEntity ? 'is-active' : '' }` } ref={ el => entitiesTitles.current[index] = el }>
                                        <p className="slider-entity-title p1" activeindex={ index + activeIndexOffset }>{ entity.name }</p>
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

export default SliderEntities;
