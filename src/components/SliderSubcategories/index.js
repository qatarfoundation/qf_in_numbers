// React
import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import SliderEntities from '@/components/SliderEntities/index';
import LabelsEntities from "@/components/LabelsEntities";

function SliderSubcategories(props, ref) {
    /**
     * Props
     */
    const { category, subcategory } = props;
    const subcategories = category.subcategories;
    const subcategoryIndex = subcategory ? subcategories.map((item) => item.id).indexOf(subcategory.id) : 0;

    /**
     * States
     */
    const [subcategoryCurrentIndex, setSubcategoryCurrentIndex] = useState(subcategoryIndex);
    const [entityCurrentIndex, setEntityCurrentIndex] = useState(0);

    /**
     * Watchers
     */
    useEffect(() => {
        history.replaceState(null, null, subcategories[subcategoryCurrentIndex].slug);
        setEntityCurrentIndex(0);
    }, [subcategoryCurrentIndex]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        setupEventListeners()
        return removeEventListeners
    }, [entityCurrentIndex])

    /**
     * Private
     */
    function next() {
        if (!isLastEntity()) {
            // Next entity
            setEntityCurrentIndex(entityCurrentIndex + 1);
        } else if (!isLastSubcategory()) {
            // Next subcategory
            setSubcategoryCurrentIndex(subcategoryCurrentIndex + 1);
        }
    }

    function previous() {
        if (!isFirstEntity()) {
            // Previous entity
            setEntityCurrentIndex(entityCurrentIndex - 1);
        } else if (!isFirstSubcategory()) {
            // Previous subcategory
            setSubcategoryCurrentIndex(subcategoryCurrentIndex - 1);
        }
    }

    /**
     * Events
     */
    function setupEventListeners() {
        window.addEventListener("wheel", wheelHandler)
    }

    function removeEventListeners() {
        window.removeEventListener("wheel", wheelHandler)
    }

    /**
     * Handlers
     */
    function wheelHandler(e) {
        if (Math.abs(e.deltaY) > 10 && !Globals.webglApp.isMovingToEntity()){
            if (e.deltaY > 0)
                clickBottomHandler()
            else
                clickTopHandler()
        }
    }

    function clickTopHandler() {
        if (!isPreviousEnabled()) return;

        previous();
    }

    function clickBottomHandler() {
        if (!isNextEnabled()) return;

        next();
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

    function isFirstEntity() {
        return entityCurrentIndex === 0;
    }

    function isLastEntity() {
        return entityCurrentIndex === subcategories[subcategoryCurrentIndex].entities.length - 1;
    }

    function isFirstSubcategory() {
        return subcategoryCurrentIndex === 0;
    }

    function isLastSubcategory() {
        return subcategoryCurrentIndex === subcategories.length - 1;
    }

    function isPreviousEnabled() {
        return !(isFirstEntity() && isFirstSubcategory());
    }

    function isNextEnabled() {
        return !(isLastEntity() && isLastSubcategory());
    }

    return (
        <>
            <div className="slider-subcategories">

                { /* Navigation */ }
                <div className="slider-navigation">
                    <button className={ 'button button-navigation button-navigation-top' } disabled={ !isPreviousEnabled() } onClick={ clickTopHandler }></button>
                    <button className={ 'button button-navigation button-navigation-bottom' } disabled={ !isNextEnabled() } onClick={ clickBottomHandler }></button>
                </div>

                <div className="slider-content">

                    <p className="slider-subcategory-title h3">{ romanize(subcategoryCurrentIndex + 1) }. { subcategories[subcategoryCurrentIndex].name }</p>

                    {
                        <AnimatePresence exitBeforeEnter>

                            <SliderEntities key={ subcategories[subcategoryCurrentIndex].id } category={ category } subcategory={ subcategories[subcategoryCurrentIndex] } currentIndex={ entityCurrentIndex } />

                        </AnimatePresence>
                    }

                </div>

            </div>

            <LabelsEntities key={ subcategoryCurrentIndex } entities={ category.subcategories[subcategoryCurrentIndex].entities } entityCurrentIndex={ entityCurrentIndex } />
        </>
    );
}

export default forwardRef(SliderSubcategories);
