// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Components
import PanelEntity from '@/components/PanelEntity';

// Utils
import Globals from '@/utils/Globals';

function EntityTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const entity = data.entity[language].current;
    const entityNext = data.entity[language].next;
    const entityPrevious = data.entity[language].previous;
    usePopulateTreeDataModel(year.year, year.categories);
    console.log(data);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        Globals.webglApp.gotoEntity(category.name, entity.name);
    }, []);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function transitionIn() {
        const timeline = new gsap.timeline({ onComplete: transitionInCompleted });
        timeline.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        return timeline;
    }

    function transitionOut() {
        const timeline = new gsap.timeline({ onComplete: transitionOutCompleted });
        timeline.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0);
        return timeline;
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-entity" ref={ el }>
            <PanelEntity entity={ entity } next={ entityNext } previous={ entityPrevious } />
        </div>
    );
}

export default EntityTemplate;

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
