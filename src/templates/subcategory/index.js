// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import ButtonBack from '@/components/ButtonBack/index';
import SliderSubcategories from '@/components/SliderSubcategories/index';
import SliderSubcategoriesMobile from '@/components/SliderSubcategoriesMobile/index';

function SubcategoryTemplate(props) {
    /**
     * Data
     */
    const { t } = useTranslation();
    const { language } = props.pageContext;
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const subcategory = data.subcategory ? data.subcategory[language] : null;

    /**
     * States
     */
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Watchers
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut();
    }, [isPresent]);

    /**
     * Refs
     */
    const elRef = useRef();
    const buttonBackRef = useRef();

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
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function resizeHandler() {
        setBreakpoints(Breakpoints.current);
    }

    /**
     * Private
     */
    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline({ onComplete: transitionInCompleted });

        timelines.current.transitionIn.to(elRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0.5);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompleted });

        timelines.current.transitionOut.to(elRef.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0.5);
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-subcategory" ref={ elRef }>

            <Helmet>
                <title>{ `${ data.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name } - ${ subcategory ? subcategory.name : '' }` }</title>
                <meta property="og:title" content={ `${ props.pageContext.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name } - ${ subcategory ? subcategory.name : '' }` } />
            </Helmet>

            <div className="button-back-container">

                <ButtonBack ref={ buttonBackRef } name={ t('Back') } slug={ year.slug } />

            </div>

            <div className="slider-container">

                {
                    breakpoints === 'small' ?
                        <SliderSubcategoriesMobile category={ category } subcategory={ subcategory } />
                        :
                        <SliderSubcategories category={ category } subcategory={ subcategory } />
                }

            </div>

        </div>
    );
}

export default SubcategoryTemplate;

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
