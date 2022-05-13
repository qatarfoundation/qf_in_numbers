// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';

// Components
import ListSubcategories from '@/components/ListSubcategories';
import LabelsEntities from '@/components/LabelsEntities';

function CategoryTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [entities, setEntities] = useState([]);
    const [isPresent, safeToRemove] = usePresence();
    const { navigate } = useI18next();

    /**
     * Store
     */
    const enitity = useStore((state) => state.selectedEntity);

    /**
     * Hooks
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const subcategory = data.subcategory ? data.subcategory[language] : null;
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        useStore.setState({ currentCategory: category });
        useStore.setState({ currentSubcategory: subcategory });

        if (subcategory) {
            Globals.webglApp.gotoSubcategory(category.name, subcategory.name);
        } else {
            Globals.webglApp.gotoCategory(category.name);
        }
    }, []);

    useEffect(() => {
        if (subcategory) setEntities(subcategory.entities);

        const handler = (name) => {
            const subcategories = category.subcategories;
            const subcategory = subcategories.filter(subcategory => subcategory.name === name)[0];
            if (subcategory) setEntities(subcategory.entities);
        };

        TreeDataModel.addEventListener('subcategory/active', handler);

        return () => {
            TreeDataModel.addEventListener('subcategory/active', handler);
        };
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

    function buttonDiscoverClickHandler() {
        const { slug, name } = enitity;
        navigate(slug);
        // Globals.webglApp.selectEntity(category.name, name);
    }

    return (
        <div className="template-category" ref={ el }>

            <div className="container-page container">

                <ListSubcategories categoryName={ category.name } subcategories={ category.subcategories } />

                { enitity &&
                    <>
                        { /* <LabelsEntities entities={ entities } /> */ }
                        <button className="button button-discover" onClick={ buttonDiscoverClickHandler }>Click to discover</button>
                    </>
                }

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
