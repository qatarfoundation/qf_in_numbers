// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

// Components
import PanelEntity from '@/components/PanelEntity';

// Utils
import Globals from '@/utils/Globals';
import ButtonPagination from '@/components/ButtonPagination/index';

function EntityTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();/**
    * Store
    */
    const [modalEntityIsOpen] = useStore(s => [s.modalEntityIsOpen]);
    /**
     * Effects
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const subcategory = data.subcategory ? data.subcategory[language] : null;
    const entity = data.entity[language].current;
    const entityNext = data.entity[language].next;
    const entityPrevious = data.entity[language].previous;
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        useStore.setState({ currentCategory: category });
        useStore.setState({ currentSubcategory: subcategory });
        // Globals.webglApp.gotoEntity(category.slug, entity.slug);
        Globals.webglApp.selectEntity(category.name, entity.name);
    }, []);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalEntityIsOpen: false });
    }
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
            <ButtonPagination  name='Back' slug={ entity.slug.slice(0, entity.slug.lastIndexOf('/')) } direction='left' onClick={ clickHandler } />
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
