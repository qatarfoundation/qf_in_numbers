// Vendor
import { gsap } from 'gsap';

// React
import React, { useState, useRef, useEffect } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';

// Utils
import Globals from '@/utils/Globals';

// Components
import ListSubcategories from '@/components/ListSubcategories';

function CategoryTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Hooks
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        Globals.webglApp.gotoCategory(category.name);
    }, []);

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

                <ListSubcategories subcategories={ category.subcategories }></ListSubcategories>

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
