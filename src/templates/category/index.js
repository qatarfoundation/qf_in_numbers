// Vendor
import { gsap } from 'gsap';

// React
import React, { useState, useRef, useEffect } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';

// Components
import ListSubcategories from '@/components/ListSubcategories';

function CategoryTemplate(props, ref) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    const data = useTemplateData(props.pageContext);

    const [year, setYear] = useState(data.year[language]);
    const [category, setCategory] = useState(data.category[language]);
    const [subcategory, setSubcategory] = useState(data.subcategory ? data.subcategory[language] : null);

    useEffect(() => {
        setYear(data.year[language]);
        setCategory(data.category[language]);
        setSubcategory(data.subcategory ? data.subcategory[language] : null);
    }, [data, language]);

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(el.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-category" ref={ el }>

            <div className="container-page container">

                <ListSubcategories year={ year } category={ category } subcategory={ subcategory } subcategories={ category.subcategories }></ListSubcategories>

            </div>

        </div>
    );
}

export default CategoryTemplate;

export const query = graphql`
    query ($language: String!) {
        locales: allLocale(filter: {language: {eq: $language}}) {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
    }
`;
