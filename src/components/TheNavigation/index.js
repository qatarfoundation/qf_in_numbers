// Vendor
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

const TheNavigation = (props) => {
    const { languages, originalPath } = useI18next();

    const locales = languages.map((language) => {
        const label = language === 'en-US' ? 'en' : 'ar';
        return { language, label };
    });

    return (
        <div className="the-navigation">
            <ul className="language-switch">
                { locales.map((locale) => (
                    <li key={ locale.language }>
                        <Link to={ originalPath } language={ locale.language }>
                            { locale.label }
                        </Link>
                    </li>
                )) }
            </ul>
        </div>
    );
};

export default TheNavigation;
