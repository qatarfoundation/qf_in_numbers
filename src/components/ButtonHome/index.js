// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Logo from '@/assets/icons/logo.svg';

const ButtonHome = (props, ref) => {
    return (
        <Link to="/" className="button button-home">

            <Logo className="logo" />

        </Link>
    );
};

export default ButtonHome;
