// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

const LangSwitch = (props) => {
    const { language, originalPath } = useI18next();

    const buttons = {
        'ar': {
            label: 'English',
            locale: 'en-US',
            className: 'en',
        },
        'en-US': {
            label: 'العربية',
            locale: 'ar',
            className: 'ar',
        },
    };

    const button = buttons[language];

    return (
        <div className={ `language-switch ${button.className}` } >
            <Link className="button" to={ originalPath } language={ button.locale }>
                { button.label }
            </Link>
        </div>
    );
};

export default LangSwitch;
