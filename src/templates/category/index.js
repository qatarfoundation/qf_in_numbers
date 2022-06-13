// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useScrollList from './useScrollList';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';
import Breakpoints from '@/utils/Breakpoints';

// Components
import ListSubcategories from '@/components/ListSubcategories';
import LabelsEntities from '@/components/LabelsEntities';
import Scrollbar from '@/components/ScrollBar/index';
import SliderSubcategories from '@/components/SliderSubcategories/index';
import ButtonPagination from '@/components/ButtonPagination/index';
import ButtonScroll from '@/components/ButtonScroll/index';

function CategoryTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [entities, setEntities] = useState([]);
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);
    const [isPresent, safeToRemove] = usePresence();
    const { navigate } = useI18next();

    /**
     * Store
     */
    const [enitity, currentSubcategory] = useStore((state) => [state.selectedEntity, state.currentSubcategory]);

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
        const slug = category.slug.split('/').slice(-1)[0];
        if (subcategory) {
            Globals.webglApp.gotoSubcategory(slug, subcategory.name);
        } else {
            Globals.webglApp.gotoCategory(slug);
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
     * Events
     */
    useWindowResizeObserver(resizeHandler);
    // useScrollList(category, subcategory);

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

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

    function resize() {
        setBreakpoints(Breakpoints.current);
    }

    return (
        <div className="template-category" ref={ el }>
            { breakpoints == 'small' ?
                <SliderSubcategories category={ category } subcategories={ category.subcategories } />
                :
                <Scrollbar revert={ true } data-name="listSubcategories">
                    <div className="container-page container">
                        <ListSubcategories category={ category } subcategories={ category.subcategories } />
                    </div>
                </Scrollbar>
            }
            { enitity &&
                    <>
                        { /* <LabelsEntities entities={ entities } /> */ }
                        <ButtonPagination name={ breakpoints == 'small' ? `Tap to discover ${ enitity.name }` : 'Click to discover' } slug={ enitity.slug } direction='right' />
                    </>
            }
            { currentSubcategory && <ButtonScroll>{ `Scroll to explore the ${ currentSubcategory.name } branch` }</ButtonScroll> }

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
