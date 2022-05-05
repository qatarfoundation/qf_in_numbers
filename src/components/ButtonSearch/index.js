// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Search from '@/assets/icons/search.svg';

function ButtonSearch(props, ref) {
    return (
        <button className="button button-search">
            <Search className="search" />
        </button>
    );
}

export default ButtonSearch;
