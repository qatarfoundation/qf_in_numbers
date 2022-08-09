// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Logo from '@/assets/icons/logo.svg';

// Hooks
import useStore from '@/hooks/useStore';

function ButtonHome(props, ref) {
    const currentYear = useStore((state) => state.currentYear);

    return (
        <Link to={ `/${ currentYear }` }className="button button-home">

            <Logo className="logo" />

        </Link>
    );
}

export default ButtonHome;
