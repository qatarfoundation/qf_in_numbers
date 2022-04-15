// Vendor
import { gsap } from 'gsap';

// React
import React, { useState, useRef, useEffect } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ListSubcategories from '@/components/ListSubcategories';

const CategoryTemplate = (props, ref) => {
    /**
     * Data
     */
    const category = props.pageContext;

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

                <ListSubcategories year={ category.year } category={ category } subcategories={ category.subcategories } ></ListSubcategories>

            </div>

        </div>
    );
};

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
