// Vendor
import React, { useEffect, useRef, useState } from 'react';
import loadable from '@loadable/component';
import { AnimatePresence } from 'framer-motion';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import { Helmet } from 'react-helmet';

// CSS
import '@/assets/styles/app.scss';
import './index/style.scoped.scss';
import 'swiper/css';

// Utils
import Globals from '@/utils/Globals';

// Components
import ThePreloader from '@/components/ThePreloader';
import TheNavigation from '@/components/TheNavigation';
import TheFooter from '@/components/TheFooter';
const WebglApp = loadable(() => import('@/components/WebglApp'));

// Providers
import { EnvironmentProvider, getEnvironment, DEVELOPMENT } from '@/contexts/EnvironmentContext';

// Hooks
import usePreloader, { LOADING } from '@/hooks/usePreloader';
import useStore from '@/hooks/useStore';

function Layout(props) {
    const containerRef = useRef();

    /**
     * Props
     */
    const { children } = props;

    /**
     * States
     */
    const [webglAppState, setWebglAppState] = useState(undefined);
    const [isFinishAnimPreload, setIsFinishAnimPreload] = useState(getEnvironment() === DEVELOPMENT);

    /**
     * Stores
     */
    const [isTutorial, themeCategory] = useStore((state) => [state.isTutorial, state.themeCategory]);

    /**
     * Data
     */
    const { i18n } = useTranslation();
    const { navigate, originalPath, language } = useI18next();
    Globals.navigate = navigate; // NOTE: Add to global to be able to use it in the Webgl application

    /**
     * Effects
     */

    useEffect(() => {
        if (props.pageContext.year) {
            const entities = props.pageContext.year[language].categories.map(d => d.subcategories.map(d => d.entities.map(d => {
                return { value: d.name, slug: d.slug  };
            }))).flat(2);
            const tags = props.pageContext.year[language].categories.map(d => d.subcategories.map(d => d.entities.map(d => d.tags ? d.tags.map(d => {
                return { value: d.name, slug: d.slug  };
            }) : []))).flat(3);
            useStore.setState({ currentYear: props.pageContext.year[language].year, allEntities: [...entities], allTags: [...tags] });
        }
    }, []);

    useEffect(() => {
        useStore.setState({ themeCategory: getThemeCategory(originalPath.split('/')[2]) });
    }, [originalPath]);

    useEffect(() => {
        useStore.setState({ locale: language });
    }, []);

    /**
     * Hooks
     */
    const { state, progress } = usePreloader();

    /**
     * Handlers
     */
    function stateChangeHandler(state) {
        setWebglAppState(state);
    }

    /**
     * Private
     */
    function getThemeCategory(categoryName) {
        if (categoryName) {
            let theme = 'theme-';
            switch (categoryName) {
                case 'community':
                    theme += 'blue';
                    break;
                case 'research':
                    theme += 'red';
                    break;
                case 'education':
                    theme += 'green';
                    break;
            }
            return theme;
        }
        return 'theme-default';
    }

    return (
        <div className={ themeCategory ? themeCategory : '' }>
            <Helmet htmlAttributes={ { lang: language } } bodyAttributes={ { dir: i18n.dir(), class: language === 'ar-QA' ? 'ar' : language } }>
                <title>{ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoMetaTitle : 'Qatar Foundation in Numbers - 404' }</title>
                <meta name="description" content={ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoMetaDescription : '' } />
            </Helmet>

            <EnvironmentProvider>

                <div className="container" ref={ containerRef }>

                    <WebglApp preloaderState={ state } onStateChange={ stateChangeHandler } containerRef={ containerRef } />

                    { webglAppState === 'started' && isFinishAnimPreload &&

                        <AnimatePresence exitBeforeEnter>

                            <div key={ originalPath } className="page">
                                { children }
                                { /* {
                                    !isTutorial && <>
                                        <TheNavigation key={ `${ language }-navigation` } />
                                        <TheFooter key={ `${ language }-footer` } />
                                    </>
                                } */ }
                            </div>

                        </AnimatePresence>

                    }

                </div>

                <AnimatePresence>
                    {
                        getEnvironment() !== DEVELOPMENT
                        &&
                        <ThePreloader visible={ state === LOADING } progress={ progress } setIsFinishAnimPreload={ setIsFinishAnimPreload } />
                    }
                </AnimatePresence>

            </EnvironmentProvider>
        </div>
    );
}

export default Layout;

/**
 * Clears console on reload
 */
if (module.hot) {
    module.hot.accept();
    module.hot.addStatusHandler((status) => {
        if (status === 'prepare') {
            console.clear();
        }
    });
}
