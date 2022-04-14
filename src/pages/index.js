// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { useTranslation, Link } from 'gatsby-plugin-react-i18next';

// CSS
import '@/pages/home/style.scoped.scss';

// Components
import Heading from '@/components/Heading';

const IndexPage = (props, ref) => {
    const { t } = useTranslation();

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    useEffect(() => {
        // console.log({ isPresent });
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    /**
     * Refs
     */
    const el = useRef();
    // const heading = useRef();

    /**
     * Private
     */
    function transitionIn() {
        const timeline = new gsap.timeline({ onComplete: transitionInCompleted });
        timeline.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        // timeline.add(heading.current.show(), 0);
        return timeline;
    }

    function transitionOut() {
        const timeline = new gsap.timeline({ onComplete: transitionOutCompleted });
        timeline.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0);
        // timeline.add(heading.current.hide(), 0);
        return timeline;
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    /**
     * Render
     */
    return (
        <div className="page" ref={ el }>
            {/* <div className="container">
                <Heading ref={ heading } title={ t('heading') } />
                <Link to="/2021">Go to 2021</Link>
            </div> */}
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
    }
`;
