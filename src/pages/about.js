// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { Link, graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// CSS
import '@/pages/about/style.scoped.scss';

// Components
import Heading from '@/components/Heading';

const IndexPage = (props, ref) => {
    const { t } = useTranslation();

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Effects
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
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
     * Render
     */
    return (
        <div className="page" ref={ el }>
            <div className="container">
                <Heading title="About" />
                <Link to="/">Go to Home</Link>
            </div>

        </div>
    );
};

export default IndexPage;

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
        allContentfulHomePage(filter: {node_locale: {eq: $language}}) {
            edges {
                node {
                    id
                    heading
                    seo {
                        seoMetaTitle
                        seoMetaDescription
                    }
                }
            }
        }
    }
`;
