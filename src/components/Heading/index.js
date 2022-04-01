// React
import React from 'react';
import { Link, Trans, useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
// import './style.scoped.scss';
import * as styles from './style.module.scss';

const Heading = (props) => {
    const { t } = useTranslation();

    return (
        <h1 className={ styles.heading }>{ t('heading') }</h1>
    );
};

export default Heading;
