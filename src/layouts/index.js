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
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';

// Hooks
import usePreloader, { LOADING } from '@/hooks/usePreloader';
import useStore from '@/hooks/useStore';
import useTemplateData from '@/hooks/useTemplateData';

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

    /**
     * Stores
     */
    const isTutorial = useStore(s => s.isTutorial);

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

    /**
     * Hooks
     */
    const preloaderState = usePreloader();

    /**
     * Handlers
     */
    function stateChangeHandler(state) {
        setWebglAppState(state);
    }

    return (
        <div>
            <Helmet
                htmlAttributes={ { lang: language } }
                bodyAttributes={ { dir: i18n.dir(), class: language === 'ar-QA' ? 'ar' : language } }
            />

            <EnvironmentProvider>

                <div className="container" ref={ containerRef }>

                    <WebglApp preloaderState={ preloaderState } onStateChange={ stateChangeHandler } containerRef={ containerRef } />

                    { webglAppState === 'started' &&

                        <AnimatePresence>

                            <div key={ originalPath } className="page">
                                { children }
                                <TheNavigation key={ `${ language }-navigation` } />
                                {
                                    !isTutorial && <>
                                        <TheFooter key={ `${ language }-footer` } />
                                    </>
                                }
                            </div>

                        </AnimatePresence>

                    }

                </div>

                <ThePreloader visible={ preloaderState === LOADING } />

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
