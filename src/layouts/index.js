// Vendor
import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useLocation } from '@reach/router';
import { AnimatePresence } from 'framer-motion';

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
import usePreloader, { LOADING } from '@/layouts/index/preloader';

const Layout = (props) => {
    const { uri, children } = props;

    const location = useLocation();
    const preloaderState = usePreloader();

    useEffect(() => {
        console.log(location);
    }, [location]);

    let page = uri.substring(1);
    page = page ? page : 'home';

    return (
        <div>
            <EnvironmentProvider>

                <WebglApp page={ page } preloaderState={ preloaderState } />

                {/* Pages */}
                <AnimatePresence exitBeforeEnter>

                    <div key={ location.key } className="page">
                        { children }
                    </div>

                </AnimatePresence>

                <TheNavigation />

                <ThePreloader visible={ preloaderState === LOADING } />

            </EnvironmentProvider>
        </div>
    );
};

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
