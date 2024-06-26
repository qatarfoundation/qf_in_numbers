// Vendor
import React, { useEffect, useRef, useState } from 'react';
import loadable from '@loadable/component';
import { AnimatePresence } from 'framer-motion';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import { Helmet } from 'react-helmet';
import { gsap } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
import CustomEase from '@/vendor/gsap/CustomEase';

// CSS
import '@/assets/styles/app.scss';
import './index/style.scoped.scss';
import 'swiper/css';

// Configs
import themes from '@/configs/themes';

// Utils
import Globals from '@/utils/Globals';

// Components
import ThePreloader from '@/components/ThePreloader';
import TheNavigation from '@/components/TheNavigation';
import ModalYear from '@/components/ModalYear';
import ModalSearch from '@/components/ModalSearch';
import ModalSubcategories from '@/components/ModalSubcategories/index';
import ModalMenu from '@/components/ModalMenu';
const WebglApp = loadable(() => import('@/components/WebglApp'));

// Providers
import { EnvironmentProvider, getEnvironment, DEVELOPMENT } from '@/contexts/EnvironmentContext';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';
import usePreloader, { LOADING } from '@/hooks/usePreloader';
import useStore from '@/hooks/useStore';

// GSAP Plugins
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(SplitText);

function Layout(props) {
    /**
     * Props
     */
    const { children } = props;

    /**
     * Data
     */
    const { i18n } = useTranslation();
    const { navigate, originalPath, language } = useI18next();
    Globals.navigate = navigate; // NOTE: Add to global to be able to use it in the Webgl application

    // Populate tree from year categories
    const year = props.pageContext.year ? props.pageContext.year[language] : null;
    usePopulateTreeDataModel(year ? year.categories : null);

    /**
     * States
     */
    const [webglAppState, setWebglAppState] = useState(undefined);
    const [isFinishAnimPreload, setIsFinishAnimPreload] = useState(false);

    /**
     * Stores
     */
    const [themeCategory, isModalMenuOpen] = useStore((state) => [state.themeCategory, state.isModalMenuOpen]);

    /**
     * Refs
     */
    const containerRef = useRef();
    const themeTimeout = useRef();

    /**
     * Hooks
     */
    const { state, progress } = usePreloader();

    /**
     * Watchers
     */
    useEffect(() => {
        clearTimeout(themeTimeout.current);
        const categoryName = props.pageContext.category ? props.pageContext.category['en-US'].name.toLowerCase() : null;
        themeTimeout.current = setTimeout(() => {
            const themeCategory = getThemeCategory(categoryName);
            const themeColors = themes[themeCategory];
            useStore.setState({ themeCategory });
            useStore.setState({ themeColors });
        }, 1000);
    }, [props.pageContext.category]);

    useEffect(() => {
        const currentYear = props.pageContext.year ? props.pageContext.year[language].year : null;
        if (currentYear) useStore.setState({ currentYear });
    }, [props.pageContext.year]);

    useEffect(() => {
        if (webglAppState !== 'started') return;

        // Dev mode
        if (getEnvironment() === DEVELOPMENT) {
            setIsFinishAnimPreload(true);
        }
    }, [webglAppState]);

    useEffect(() => {
        if (isModalMenuOpen) {
            gsap.to(containerRef.current, { duration: 1, scale: 0.98, ease: 'power1.inOut' });
            gsap.to(containerRef.current, { duration: 1, translateY: '5%', ease: 'power1.inOut' });
            gsap.to(containerRef.current, { duration: 1, opacity: 0.2, ease: 'power1.inOut' });
        } else {
            gsap.to(containerRef.current, { duration: 1, delay: 0.2, scale: 1, ease: 'power1.out' });
            gsap.to(containerRef.current, { duration: 1, delay: 0.2, translateY: '0', ease: 'power1.out' });
            gsap.to(containerRef.current, { duration: 1, delay: 0.2, opacity: 1, ease: 'power1.out' });
        }
    }, [isModalMenuOpen]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        useStore.setState({ locale: language });

        if (props.pageContext.year) useStore.setState({ currentYear: props.pageContext.year[language].year });
    }

    function destroy() {

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

    /**
     * Handlers
     */
    function stateChangeHandler(state) {
        setWebglAppState(state);
    }

    function preloaderAnimationCompletedHandler() {
        // Globals.webglApp.transitionIn();
        setIsFinishAnimPreload(true);
    }

    return (
        <div className={ themeCategory ? themeCategory : '' }>

            { /* SEO */ }
            <Helmet htmlAttributes={ { lang: language } } bodyAttributes={ { dir: i18n.dir(), class: language === 'ar-QA' ? 'ar' : language } }>
                { process.env.GATSBY_PREVENT_INDEXING === 'true' && <meta name="robots" content="noindex, nofollow" /> }
                { process.env.GATSBY_PREVENT_INDEXING === 'true' && <meta name="googlebot" content="noindex, nofollow" /> }
                <title>{ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoMetaTitle : 'Qatar Foundation in Numbers - 404' }</title>
                <meta name="description" data-test={ process.env.PREVENT_INDEXING } content={ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoMetaDescription : '' } />
                { /* OG */ }
                <meta property="og:url" content={ process.env.GATSBY_BASE_URL } />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoMetaTitle : 'Qatar Foundation in Numbers - 404' } />
                <meta property="og:description" content={ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoMetaDescription : '' } />
                <meta property="og:image" content={ props.pageContext.home ? props.pageContext.home[language].seo.fields.seoShareImage.fields.file.url : '' } />
            </Helmet>

            <EnvironmentProvider>

                <div className="container" ref={ containerRef }>

                    { /* WebGL */ }
                    <WebglApp preloaderState={ state } onStateChange={ stateChangeHandler } containerRef={ containerRef } />

                    { /* Navigation */ }
                    { originalPath !== '/' &&

                        <TheNavigation pageContext={ props.pageContext } />

                    }

                    { /* Page */ }
                    { webglAppState === 'started' && isFinishAnimPreload &&

                        <AnimatePresence exitBeforeEnter>

                            <div key={ originalPath } className="page">
                                { children }
                            </div>

                        </AnimatePresence>

                    }

                </div>

                { /* Preloader */ }
                <AnimatePresence>

                    { getEnvironment() !== DEVELOPMENT && <ThePreloader visible={ state === LOADING } progress={ progress } layoutProps={ props } setIsFinishAnimPreload={ preloaderAnimationCompletedHandler } /> }

                </AnimatePresence>

                { /* Modals */ }
                {
                    webglAppState === 'started' && isFinishAnimPreload &&
                    <>
                        <ModalYear pageContext={ props.pageContext } />
                        <ModalSearch pageContext={ props.pageContext } />
                        { /* <ModalSubcategories pageContext={ props.pageContext } /> */ }
                        <ModalMenu pageContext={ props.pageContext } />
                    </>
                }

            </EnvironmentProvider>

            { /* Used in Entity > ChartKPI */ }
            <div id="more-info-bubble"></div>
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
