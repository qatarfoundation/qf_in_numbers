// Vendor
import React from 'react';

// CSS
import * as styles from './style.module.scss';

// Hooks
import useResourceLoader from './resourceLoader';

const ThePreloader = (props) => {
    const visible = useResourceLoader();

    return visible ? (
        <div className={ styles.thePreloader }>The preloader</div>
    ) : null;
};

export default ThePreloader;
