// Vendor
import React from 'react';

// CSS
import './style.scoped.scss';

function ThePreloader({ visible, ...props }) {
    return visible ? (
        <div className="the-preloader">The preloader</div>
    ) : null;
}

export default ThePreloader;
