// React
import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Vendor
import { Lethargy } from 'lethargy';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import SliderEntities from '@/components/SliderEntities/index';
import LabelsEntities from '@/components/LabelsEntities';
import ButtonFullList from '@/components/ButtonFullList';

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

    const entityCurrentIndexRef = useRef(entityCurrentIndex);
    entityCurrentIndexRef.current = entityCurrentIndex;
    const subcategoryCurrentIndexRef = useRef(subcategoryCurrentIndex);
    subcategoryCurrentIndexRef.current = subcategoryCurrentIndex;

    const waitRef = useRef(false);

    const lethargy = new Lethargy();

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
        setupEventListeners();
        return removeEventListeners;
    }, []);

    /**
     * Private
     */
    function next() {
        if (!isLastEntity()) {
            // Next entity
            setEntityCurrentIndex(i => i + 1);
        } else if (!isLastSubcategory()) {
            // Next subcategory
            setSubcategoryCurrentIndex(i => i + 1);
        }
    }

    function previous() {
        if (!isFirstEntity()) {
            // Previous entity
            setEntityCurrentIndex(i => i - 1);
        } else if (!isFirstSubcategory()) {
            // Previous subcategory
            setSubcategoryCurrentIndex(i => i - 1);
        }
    }

    /**
     * Events
     */
    function setupEventListeners() {
        window.addEventListener('wheel', wheelHandler);
    }

    function removeEventListeners() {
        window.removeEventListener('wheel', wheelHandler);
    }

    /**
     * Handlers
     */
    function wheelHandler(e) {
        const check = lethargy.check(e);
        if (check && !Globals.webglApp.isMovingToEntity()) {
            if (!waitRef.current) {
                if (check < 0)
                    clickBottomHandler();
                else
                    clickTopHandler();
            }
            waitRef.current = true;
        } else {
            waitRef.current = false;
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
    function isFirstEntity() {
        return entityCurrentIndexRef.current === 0;
    }

    function isLastEntity() {
        return entityCurrentIndexRef.current === subcategories[subcategoryCurrentIndexRef.current].entities.length - 1;
    }

    function isFirstSubcategory() {
        return subcategoryCurrentIndexRef.current === 0;
    }

    function isLastSubcategory() {
        return subcategoryCurrentIndexRef.current === subcategories.length - 1;
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

                    <p className="slider-subcategory-title h3">{ subcategories[subcategoryCurrentIndex].name }</p>

                    {
                        <AnimatePresence exitBeforeEnter>

                            <SliderEntities key={ subcategories[subcategoryCurrentIndex].id } category={ category } subcategory={ subcategories[subcategoryCurrentIndex] } currentIndex={ entityCurrentIndex } />

                        </AnimatePresence>
                    }

                    <ButtonFullList />

                </div>

            </div>

            <LabelsEntities key={ subcategoryCurrentIndex } entities={ category.subcategories[subcategoryCurrentIndex].entities } entityCurrentIndex={ entityCurrentIndex } />
        </>
    );
}

export default forwardRef(SliderSubcategories);
