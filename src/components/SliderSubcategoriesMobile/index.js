// React
import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { AnimatePresence } from 'framer-motion';

// CSS
import './style.scoped.scss';

// Components
import SliderEntitiesMobile from '@/components/SliderEntitiesMobile/index';

function SliderSubcategoriesMobile(props, ref) {
    /**
     * Props
     */
    const { category, subcategory } = props;
    const subcategories = category.subcategories;
    const subcategoryIndex = subcategory ? subcategories.map((item) => item.id).indexOf(subcategory.id) : 0;

    /**
     * Data
     */
    const { language } = useI18next();

    /**
     * States
     */
    const [subcategoryCurrentIndex, setSubcategoryCurrentIndex] = useState(subcategoryIndex);
    const [entityCurrentIndex, setEntityCurrentIndex] = useState(0);

    /**
     * Watchers
     */
    useEffect(() => {
        setEntityCurrentIndex(0);
    }, [subcategoryCurrentIndex]);

    /**
     * Private
     */
    function next() {
        if (!isNextEnabled()) return;

        if (!isLastEntity()) {
            // Next entity
            setEntityCurrentIndex(entityCurrentIndex + 1);
        } else if (!isLastSubcategory()) {
            // Next subcategory
            setSubcategoryCurrentIndex(subcategoryCurrentIndex + 1);
        }
    }

    function previous() {
        if (!isPreviousEnabled()) return;

        if (!isFirstEntity()) {
            // Previous entity
            setEntityCurrentIndex(entityCurrentIndex - 1);
        } else if (!isFirstSubcategory()) {
            // Previous subcategory
            setSubcategoryCurrentIndex(subcategoryCurrentIndex - 1);
        }
    }

    /**
     * Handlers
     */
    function clickLeftHandler() {
        if (language === 'ar-QA') {
            next();
        } else {
            previous();
        }
    }

    function clickRightHandler() {
        if (language === 'ar-QA') {
            previous();
        } else {
            next();
        }
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

    function isLeftEnabled() {
        if (language === 'ar-QA') return isNextEnabled();
        else return isPreviousEnabled();
    }

    function isRightEnabled() {
        if (language === 'ar-QA') return isPreviousEnabled();
        else return isNextEnabled();
    }

    return (
        <div className="slider-subcategories">

            <div className="slider-content">

                <p className="slider-subcategory-title h3">{ romanize(subcategoryCurrentIndex + 1) }. { subcategories[subcategoryCurrentIndex].name }</p>

                {
                    <AnimatePresence exitBeforeEnter>

                        <SliderEntitiesMobile key={ subcategories[subcategoryCurrentIndex].id } category={ category } subcategory={ subcategories[subcategoryCurrentIndex] } currentIndex={ entityCurrentIndex } />

                    </AnimatePresence>
                }

            </div>

            { /* Navigation */ }
            <div className="slider-navigation">
                <button className={ 'button button-navigation button-navigation-left' } disabled={ !isLeftEnabled() } onClick={ clickLeftHandler }></button>
                <button className={ 'button button-navigation button-navigation-right' } disabled={ !isRightEnabled() } onClick={ clickRightHandler }></button>
            </div>

        </div>
    );
}

export default forwardRef(SliderSubcategoriesMobile);
