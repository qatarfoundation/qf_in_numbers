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

    }

    /**
     * Private
     */
    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline({ onComplete: transitionInCompleted });

        timelines.current.transitionIn.to(elRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.transitionIn.call(() => { Globals.webglApp.gotoCategory(category.id); }, null, 0);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompleted });

        timelines.current.transitionOut.to(elRef.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0);
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
                <title>{ `${ data.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name }` }</title>
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
