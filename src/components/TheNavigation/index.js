// Vendor
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import * as styles from './style.module.scss';

const TheNavigation = (props) => {
    const { languages, originalPath } = useI18next();

    return (
        <div className={ styles.theNavigation }>
            <ul className={ styles.languageSwitch }>
                { languages.map((language) => (
                    <li key={ language }>
                        <Link to={ originalPath } language={ language }>
                            { language }
                        </Link>
                    </li>
                )) }
            </ul>
        </div>
    );
};

export default TheNavigation;
