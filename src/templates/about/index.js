// Vendor
import gsap from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';

// CSS
import '@/assets/styles/app.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import PanelAbout from '@/components/PanelAbout';

function AboutTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;
    const templateData = useTemplateData(props.pageContext, language);
    const content = templateData.about[language];

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Refs
     */
    const timelines = useRef({
        transitionIn: null,
        transitionOut: null,
    });
    const panelAboutRef = useRef();

    useEffect(() => {
        return () => {
            timelines.current.transitionIn?.kill();
            timelines.current.transitionOut?.kill();
        };
    }, []);

    useEffect(() => {
        if (isPresent) transitionIn();
        if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline();
        timelines.current.transitionIn.add(panelAboutRef.current.show(), 0);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: safeToRemove });
        timelines.current.transitionOut.add(panelAboutRef.current.hide(), 0);
    }

    return (
        <div>
            <PanelAbout ref={ panelAboutRef } content={ content } />
        </div>
    );
}

export default AboutTemplate;

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
