// React
import React, { useState } from 'react';
import { useI18next, Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function ListItemYear(props) {
    /**
     * Data
     */
    const { year, active } = props;

    return (
        <li className={ `list-item-year ${ active ? 'is-active' : '' }` }>
            <Link to={ year.slug } className={ 'button button-year h4' }>
                { year.year }
            </Link>
        </li>
    );
}

export default ListItemYear;
