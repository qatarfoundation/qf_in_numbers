// Vendor
import React from 'react';

// Components
import ThePreloader from '@/components/ThePreloader';
import WebglApp from '@/components/WebglApp';

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
