// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

// Utils
import Globals from '@/utils/Globals';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import ButtonBack from '@/components/ButtonBack/index';

function CategoryTemplate(props) {
    /**
     * Data
     */
    const { t } = useTranslation();
    const { language } = props.pageContext;
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];

    console.log(category);

    /**
     * States
     */
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

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        // Globals.webglApp.gotoCategory('community');
    }

    function destroy() {

    }

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function resizeHandler() {

    }

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(elRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(elRef.current, { duration: 1, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-category" ref={ elRef }>

            <Helmet>
                <title>{ `${ props.pageContext.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name }` }</title>
            </Helmet>

            <div className="button-back-container">

                <ButtonBack ref={ buttonBackRef } name={ t('Back') } slug={ year.slug } />

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
