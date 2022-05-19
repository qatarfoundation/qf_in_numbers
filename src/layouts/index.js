// Vendor
import React, { useEffect, useRef, useState } from 'react';
import loadable from '@loadable/component';
import { AnimatePresence } from 'framer-motion';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import { Helmet } from 'react-helmet';

// CSS
import '@/assets/styles/app.scss';
import './index/style.scoped.scss';

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
     * Data
     */
    const { originalPath, language } = useI18next();
    const { i18n } = useTranslation();
    const { navigate } = useI18next();
    Globals.navigate = navigate;

    useEffect(() => {
        if (props.pageContext.year) useStore.setState({ currentYear: props.pageContext.year[language].year });
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
                                <TheFooter key={ `${ language }-footer` } />
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
