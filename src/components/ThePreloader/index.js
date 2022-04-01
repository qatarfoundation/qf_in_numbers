// Vendor
import React from 'react';

// CSS
import * as styles from './style.module.scss';

const ThePreloader = (props) => {
    return props.visible ? (
        <div className={ styles.thePreloader }>The preloader</div>
    ) : null;
};

export default ThePreloader;
