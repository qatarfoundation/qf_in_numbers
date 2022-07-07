// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Components
import PanelEntity from '@/components/PanelEntity';

// Utils
import Globals from '@/utils/Globals';
import ButtonBack from '@/components/ButtonBack/index';

function EntityTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;
    const { t } = useTranslation();

    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const subcategory = data.subcategory ? data.subcategory[language] : null;
    const entity = data.entity[language].current;
    const entityNext = data.entity[language].next;
    const entityPrevious = data.entity[language].previous;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut();
    }, [isPresent]);

    /**
     * Refs
     */
    const elRef = useRef();
    const buttonBackRef = useRef();
    const panelEntityRef = useRef();

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        // Globals.webglApp.gotoEntity(category.slug, entity.slug);
        // Globals.webglApp.selectEntity(entity, category.slug.split('/')[2]);
    }

    function destroy() {

    }

    /**
     * Private
     */
    function transitionIn() {
        const timeline = new gsap.timeline({ onComplete: transitionInCompleted });

        timeline.add(buttonBackRef.current.show(), 0);
        timeline.add(panelEntityRef.current.show(), 0);
    }

    function transitionOut() {
        const timeline = new gsap.timeline({ onComplete: transitionOutCompleted });

        timeline.add(panelEntityRef.current.hide(), 0);
        timeline.add(buttonBackRef.current.hide(), 0);
        timeline.call(() => { Globals.webglApp.hideCurrentEntity(); }, null, 0);
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-entity" ref={ elRef }>

            <Helmet>
                <title>{ `${ props.pageContext.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name } - ${ subcategory.name } - ${ entity.name }` }</title>
            </Helmet>

            <ButtonBack ref={ buttonBackRef } name={ t('Back') } slug={ entity.slug.slice(0, entity.slug.lastIndexOf('/')) } />

            <PanelEntity ref={ panelEntityRef } subcategory={ subcategory } entity={ entity } next={ entityNext } previous={ entityPrevious } />

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
