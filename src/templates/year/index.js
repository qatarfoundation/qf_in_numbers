// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';

// Utils
import Globals from '@/utils/Globals';

// Components
import ListCategories from '@/components/ListCategories';
import SubcategoriesLabel from '@/components/SubcategoriesLabel';

const YearTemplate = (props) => {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        Globals.webglApp.gotoOverview();

        useStore.setState({ currentCategory: null });
        useStore.setState({ currentSubcategory: null });
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
        <div className="template-year" ref={ el }>

            <div className="container-page container">

                <ListCategories categories={ year.categories } />

                { year.categories[0] && <SubcategoriesLabel index={ 0 } subcategories={ year.categories[0].subcategories } /> }
                { year.categories[1] && <SubcategoriesLabel index={ 1 } subcategories={ year.categories[1].subcategories } /> }
                { year.categories[2] && <SubcategoriesLabel index={ 2 } subcategories={ year.categories[2].subcategories } /> }

            </div>

        </div>
    );
};

export default YearTemplate;

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
