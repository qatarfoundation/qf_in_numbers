// React
import React, { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

// CSS
import './style.scoped.scss';

// Components
import SliderEntities from '@/components/SliderEntities/index';

function SliderSubcategories(props, ref) {
    /**
     * Props
     */
    const { category, subcategory } = props;
    const subcategoryIndex = category.subcategories.map((item) => item.id).indexOf(subcategory.id);
    const entities = subcategory.entities;

    return (
        <div className="slider-subcategories">

            <AnimatePresence exitBeforeEnter>

                <SliderEntities key={ subcategory.id } category={ category } subcategory={ subcategory } />

            </AnimatePresence>

        </div>
    );
}

export default SliderSubcategories;
