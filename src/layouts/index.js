// Vendor
import React from 'react';
import loadable from '@loadable/component';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/tree/style.module.scss';

// Components
import ThePreloader from '@/components/ThePreloader';
const WebglApp = loadable(() => import('@/components/WebglApp'));

// Hooks
import usePreloader, { LOADING } from '@/layouts/index/preloader';

const Layout = ({ uri, children }) => {
    const preloaderState = usePreloader();

    let page = uri.substring(1);
    page = page ? page : 'home';

    return (
        <div>
            <WebglApp page={ page } preloaderState={ preloaderState } />
            <div className={ styles.layout }>
                { children }
            </div>
            <ThePreloader visible={ preloaderState === LOADING } />
        </div>
    );
};

export default Layout;
