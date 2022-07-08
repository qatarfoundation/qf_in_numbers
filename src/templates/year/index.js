// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import Globals from '@/utils/Globals';
import Breakpoints from '@/utils/Breakpoints';

// Components
import ListCategories from '@/components/ListCategories';
import SubcategoriesLabel from '@/components/SubcategoriesLabel';
import SliderCategories from '@/components/SliderCategories/index';
import ButtonPagination from '@/components/ButtonPagination/index';

const YearTemplate = (props) => {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [currentCategory] = useStore((state) => [state.currentCategory]);
    const [isPresent, safeToRemove] = usePresence();
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);

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
        Globals.webglApp.enableInteractions();

        useStore.setState({ currentCategory: null });
        useStore.setState({ selectedEntity: null });
        useStore.setState({ currentSubcategory: null });
        useStore.setState({ indexActiveSubcategory: 0 });
        useStore.setState({ indexActiveEntity: 0 });
    }, []);

    /**
     * Refs
     */
    const elRef = useRef();
    const listCategoriesRef = useRef();

    const timelines = useRef({
        transitionIn: null,
        transitionOut: null,
    });

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {

    }

    function destroy() {
        timelines.current.transitionIn?.kill();
        timelines.current.transitionOut?.kill();
    }

    /**
     * Private
     */
    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline({ onComplete: transitionInCompletedHandler });

        timelines.current.transitionIn.to(elRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.transitionIn.add(listCategoriesRef.current.show(), props.location.previous ? 0 : 2);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompletedHandler });

        timelines.current.transitionOut.to(elRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
        timelines.current.transitionOut.add(listCategoriesRef.current.hide(), 0);
    }

    function resize() {
        setBreakpoints(Breakpoints.current);
    }

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
      * Handlers
      */
    function resizeHandler() {
        resize();
    }

    function transitionInCompletedHandler() {
        //
    }

    function transitionOutCompletedHandler() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-year" ref={ elRef }>

            <Helmet>
                <title>{ `${ props.pageContext.home[language].seo.fields.seoMetaTitle } - ${ year.year }` }</title>
            </Helmet>

            { breakpoints == 'small' ?
                <SliderCategories categories={ year.categories } />
                :
                <div className="container-page container">
                    <ListCategories ref={ listCategoriesRef } year={ year.year } categories={ year.categories } />
                </div>
            }

            { /* { year.categories[0] && <SubcategoriesLabel index={ 0 } subcategories={ year.categories[0].subcategories } /> }
            { year.categories[1] && <SubcategoriesLabel index={ 1 } subcategories={ year.categories[1].subcategories } /> }
            { year.categories[2] && <SubcategoriesLabel index={ 2 } subcategories={ year.categories[2].subcategories } /> } */ }

            <div className="button-discover-mobile-container">
                { currentCategory && <ButtonPagination name={ breakpoints == 'small' ? 'Tap to explore' : 'Click to discover' } slug={ currentCategory.slug } direction='right' /> }
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
