// React
import React from 'react';

// CSS
// import './style.scoped.scss';
import * as styles from './style.module.scss';

const Heading = (props) => {
    return (
        <h1 className={ styles.heading }>{ props.title }</h1>
    );
};

export default Heading;
