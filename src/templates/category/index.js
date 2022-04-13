// Vendor
import { gsap } from 'gsap';

// React
import React, { useState, useRef, useEffect } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

const CategoryTemplate = (props, ref) => {
    /**
     * Data
     */
    const { originalPath } = useI18next();
    const category = props.pageContext.name;
    const year = props.pageContext.year;
    const subcategories = props.pageContext.subcategories;
    const slugSubcategories = subcategories.map(item => item.slug);
    const initialSubcategory = props.pageContext.subcategory;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();
    const [activeSubcategoryIndex, setActiveSubcategoryIndex] = useState(initialSubcategory ? slugSubcategories.indexOf(initialSubcategory.slug) : null);

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
    const buttonSubcategories = useRef([]);

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

    /**
     * Private
     */

    /**
     * Handlers
     */
    function subcategoryClickHandler(e) {
        const index = buttonSubcategories.current.indexOf(e.currentTarget);
        setActiveSubcategoryIndex(index);
    }

    return (
        <div className="template-category" ref={ el }>

            <div className="container">

                <div className="heading">
                    { category }
                </div>

                <ul className="subcategories-list">
                    { subcategories.map((subcategory, index) => (
                        <li className="subcategories-list-item" key={ subcategory.name } >
                            <button className="button-subcategory button" onClick={ subcategoryClickHandler } ref={ (element) => buttonSubcategories.current.push(element) }>
                                { subcategory.name }
                            </button>

                            {
                                index === activeSubcategoryIndex ?
                                    <ul className="entities-list">
                                        { subcategory.entities.map((entity) => (
                                            <li className="entities-list-item" key={ entity.name }>
                                                <Link className="button-entity button" to={ `${originalPath}/${subcategory.slug}/${entity.slug}` }>
                                                    { entity.name }
                                                </Link>
                                            </li>
                                        )) }
                                    </ul> : null
                            }

                        </li>
                    )) }
                </ul>

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