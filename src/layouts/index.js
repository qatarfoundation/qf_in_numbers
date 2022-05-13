// Vendor
import React, { useState } from 'react';
import loadable from '@loadable/component';
import { AnimatePresence } from 'framer-motion';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { Helmet } from 'react-helmet';

// CSS
import '@/assets/styles/app.scss';
import './index/style.scoped.scss';

// Components
import ThePreloader from '@/components/ThePreloader';
import TheNavigation from '@/components/TheNavigation';
import TheFooter from '@/components/TheFooter';
const WebglApp = loadable(() => import('@/components/WebglApp'));

// Providers
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';

// Hooks
import usePreloader, { LOADING } from '@/hooks/usePreloader';

function Layout(props) {
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

                <WebglApp preloaderState={ preloaderState } onStateChange={ stateChangeHandler } />

                { webglAppState === 'started' &&

                    <AnimatePresence>

                        <div key={ originalPath } className="page">
                            { children }
                        </div>

                    </AnimatePresence>

                }

                <AnimatePresence exitBeforeEnter>

                    <TheNavigation key={ `${ language }-navigation` } />
                    <TheFooter key={ `${ language }-footer` } />

                </AnimatePresence>

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
