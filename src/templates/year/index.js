// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'gatsby-plugin-react-i18next';

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
    const { t } = useTranslation();

    /**
     * States
     */
    const [targetCategory, setTargetCategory] = useState(null);
    const [isPresent, safeToRemove] = usePresence();
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);

    const breakpointsRef = useRef(breakpoints);

    /**
     * Effects
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        if (breakpointsRef.current === 'small' || breakpoints === 'small') {
            if (listCategoriesRef.current) listCategoriesRef.current.show();
            if (sliderCategoriesRef.current) sliderCategoriesRef.current.show();
            // if (breakpoints === 'small') gsap.to(buttonMobileContainerRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' });
        }
        breakpointsRef.current = breakpoints;
    }, [breakpoints]);

    /**
     * Refs
     */
    const elRef = useRef();
    const listCategoriesRef = useRef();
    const sliderCategoriesRef = useRef();
    const buttonMobileContainerRef = useRef();

    const timelines = useRef({
        transitionIn: null,
        transitionOut: null,
    });

    /**
     * Store
     */
    const isCategorySelected = useStore((state) => state.isCategorySelected);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        Globals.webglApp.updateBranchInteractivity(year.categories);
        Globals.webglApp.enableInteractions();
        return destroy;
    }, []);

    function mounted() {
        useStore.setState({ currentCategory: null });
        useStore.setState({ selectedEntity: null });
    }

    function destroy() {
        timelines.current.transitionIn?.kill();
        timelines.current.transitionOut?.kill();
    }

    /**
     * Private
     */
    function transitionIn() {
        Globals.webglApp.enableMouseRotation();
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline({ onComplete: transitionInCompletedHandler });

        timelines.current.transitionIn.add(Globals.webglApp.transitionIn(), 0);
        timelines.current.transitionIn.add(Globals.webglApp.gotoOverview(), 0);
        timelines.current.transitionIn.to(elRef.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
        if (listCategoriesRef.current) timelines.current.transitionIn.add(listCategoriesRef.current.show(), props.location.previous ? 0 : 2);
        if (sliderCategoriesRef.current) timelines.current.transitionIn.add(sliderCategoriesRef.current.show(), props.location.previous ? 0 : 2);
        if (buttonMobileContainerRef.current) timelines.current.transitionIn.to(buttonMobileContainerRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' }, props.location.previous ? 0 : 2);
    }

    function transitionOut() {
        Globals.webglApp.disableMouseRotation();
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompletedHandler });

        timelines.current.transitionOut.to(elRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
        if (buttonMobileContainerRef.current) timelines.current.transitionOut.to(buttonMobileContainerRef.current, { duration: 0.5, autoAlpha: 0, ease: 'sine.inOut' }, 0);
        if (listCategoriesRef.current) timelines.current.transitionOut.add(listCategoriesRef.current.hide(), 0);
        if (sliderCategoriesRef.current) timelines.current.transitionOut.add(sliderCategoriesRef.current.hide(), 0);
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
        useStore.setState({ isCategorySelected: false });
        safeToRemove();
    }

    function activeSlideIndexChangedHandler(index) {
        setTargetCategory(year.categories[index]);
    }

    return (
        <div className="template-year" ref={ elRef }>

            <Helmet>
                <title>{ `${ props.pageContext.home[language].seo.fields.seoMetaTitle } - ${ year.year }` }</title>
                <meta property="og:title" content={ `${ props.pageContext.home[language].seo.fields.seoMetaTitle } - ${ year.year }` } />
            </Helmet>

            { breakpoints == 'small' ?
                <SliderCategories ref={ sliderCategoriesRef } categories={ year.categories } onChange={ activeSlideIndexChangedHandler } />
                :
                <div className="container-page container">
                    <ListCategories ref={ listCategoriesRef } year={ year.year } categories={ year.categories } />
                </div>
            }

            { year.categories[0] && <SubcategoriesLabel index={ 0 } categoryId={ year.categories[0].id } subcategories={ year.categories[0].subcategories } /> }
            { year.categories[1] && <SubcategoriesLabel index={ 1 } categoryId={ year.categories[1].id } subcategories={ year.categories[1].subcategories } /> }
            { year.categories[2] && <SubcategoriesLabel index={ 2 } categoryId={ year.categories[2].id } subcategories={ year.categories[2].subcategories } /> }

            { breakpoints === 'small' && isCategorySelected &&
                <div ref={ buttonMobileContainerRef } className="button-discover-mobile-container">
                    { targetCategory && <ButtonPagination name={ breakpoints == 'small' ? t('Tap to explore') : t('Click to discover') } slug={ targetCategory.slug } direction='right' /> }
                </div>
            }

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
