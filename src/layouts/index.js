// Vendor
import React from 'react';

// Components
import ThePreloader from '@/components/ThePreloader';

function Layout({ children }) {
    return (
        <div>
            {children}
            <ThePreloader />
        </div>
    );
}

export default Layout;
