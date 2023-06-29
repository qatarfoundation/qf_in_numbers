// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

// Utils
import Globals from '@/utils/Globals';
import Breakpoints from '@/utils/Breakpoints';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';

// Components
import ButtonBack from '@/components/ButtonBack';
import SubcategoryNavigation from '@/components/SubcategoryNavigation';
import Highlights from '@/components/Highlights';
import LabelsSubcategories from '@/components/LabelsSubcategories';
import LabelsEntities from '@/components/LabelsEntities';

function SubcategoryTemplate(props) {
    /**
     * Data
     */
    const { t } = useTranslation();
    const { language } = props.pageContext;
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const subcategories = category.subcategories;
    const subcategory = data.subcategory ? data.subcategory[language] : null;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();
    const activeSubcategory = useStore((state) => state.activeSubcategory);
    const highlights = activeSubcategory?.highlights && activeSubcategory.highlights.length > 0 ? activeSubcategory.highlights : category.highlights;

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
    const labelsEntitiesRef = useRef({});

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
        useStore.setState({ currentCategory: category });

        if (subcategory) {
            useStore.setState({ activeSubcategory: subcategory });
            Globals.webglApp.gotoSubcategory(category.id, subcategory.id);
        }
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

        timelines.current.transitionIn = new gsap.timeline();
        timelines.current.transitionIn.to(elRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0.5);
        timelines.current.transitionIn.call(() => {
            for (const key in labelsEntitiesRef.current) {
                labelsEntitiesRef.current[key].show();
            }
        }, null, 1);

        Globals.webglApp.gotoCategory(category.id);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompleted });
        timelines.current.transitionOut.to(elRef.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0.5);

        for (const key in labelsEntitiesRef.current) {
            labelsEntitiesRef.current[key].hide();
        }
    }

    function transitionOutCompleted() {
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

            <SubcategoryNavigation category={ category } subcategories={ subcategories } />
            {
                !Breakpoints.active('small') &&
                    <>
                        <LabelsSubcategories category={ category } subcategories={ subcategories } />
                        <Highlights data={ highlights } />
                    </>
            }
            {
                !Breakpoints.active('small') && subcategories && subcategories.map((subcategory, index) => {
                    return <LabelsEntities key={ index } ref={ (el) => { labelsEntitiesRef.current[index] = el; } } entities={ subcategory.entities } />;
                })
            }

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
