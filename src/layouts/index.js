// Vendor
import React from 'react';
import loadable from '@loadable/component';

// Components
import ThePreloader from '@/components/ThePreloader';
const WebglApp = loadable(() => import('@/components/WebglApp'));

const Layout = ({ uri, children }) => {
    let page = uri.substring(1);
    page = page ? page : 'home';

    return (
        <div>
            <WebglApp page={ page } />
            {children}
            <ThePreloader />
        </div>
    );
};

export default Layout;
