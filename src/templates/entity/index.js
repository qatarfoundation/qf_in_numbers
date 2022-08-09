// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// Utils
import Globals from '@/utils/Globals';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';

// CSS
import './style.scoped.scss';

// Components
import PanelEntity from '@/components/PanelEntity';
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
     * Private
     */
    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline({ onComplete: transitionInCompleted });

        timelines.current.transitionIn.add(buttonBackRef.current.show(), 0);
        timelines.current.transitionIn.add(panelEntityRef.current.show(), 0);
        timelines.current.transitionIn.call(() => { Globals.webglApp.selectEntity(entity, category.id); }, null, 0);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompleted });

        timelines.current.transitionOut.add(panelEntityRef.current.hide(), 0);
        timelines.current.transitionOut.add(buttonBackRef.current.hide(), 0);
        timelines.current.transitionOut.call(() => { Globals.webglApp.hideCurrentEntity(); }, null, 0);
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
                <title>{ `${ data.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name } - ${ subcategory.name } - ${ entity.name }` }</title>
                <meta property="og:title" content={ `${ data.home[language].seo.fields.seoMetaTitle } - ${ year.year } - ${ category.name } - ${ subcategory.name } - ${ entity.name }` } />
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
