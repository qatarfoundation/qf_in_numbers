// Vendor
import React, { useEffect } from 'react';
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
const WebglApp = loadable(() => import('@/components/WebglApp'));

// Providers
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';

// Hooks
import usePreloader, { LOADING } from '@/hooks/usePreloader';

function Layout(props) {
    /**
     * Props
     */
    const { uri, children } = props;

    /**
     * Data
     */
    const { originalPath, language } = useI18next();
    const { t, i18n } = useTranslation();

    /**
     * States
     */
    const preloaderState = usePreloader();

    /**
     * Effects
     */
    useEffect(() => {
        // Reset
        // document.body.classList.remove('en-US');
        // document.body.classList.remove('ar');

        // Set
        // document.body.dir = i18n.dir();
        // document.documentElement.lang = language;
        // document.body.classList.add(language);
    }, [language]);

    let page = uri.substring(1);
    page = page ? page : 'home';

    return (
        <div>
            <Helmet
                htmlAttributes={ { lang: language } }
                bodyAttributes={ { dir: i18n.dir(), class: language } }
            />

            <EnvironmentProvider>

                {/* <WebglApp page={ page } preloaderState={ preloaderState } /> */}

                <AnimatePresence exitBeforeEnter>

                    <div key={ originalPath } className="page">
                        { children }
                    </div>

                </AnimatePresence>

                <TheNavigation />

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
