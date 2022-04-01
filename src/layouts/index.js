// Vendor
import React from 'react';
import loadable from '@loadable/component';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/tree/style.module.scss';

// Components
import ThePreloader from '@/components/ThePreloader';
import TheNavigation from '@/components/TheNavigation';
const WebglApp = loadable(() => import('@/components/WebglApp'));

// Providers
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';

// Hooks
import usePreloader, { LOADING } from '@/layouts/index/preloader';

const Layout = ({ uri, children }) => {
    const preloaderState = usePreloader();

    let page = uri.substring(1);
    page = page ? page : 'home';

    return (
        <div>
            <EnvironmentProvider>
                <WebglApp page={ page } preloaderState={ preloaderState } />
                <div className={ styles.layout }>
                    { children }
                </div>
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
