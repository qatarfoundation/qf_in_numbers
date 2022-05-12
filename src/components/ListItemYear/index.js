// React
import React, { useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function ListItemYear(props) {
    /**
     * Data
     */
    const { year } = props;
    /**
     * States
     */
    const { navigate } = useI18next();
    /**
     * Store
     */
    const [isOpen, currentYear] = useStore((state) => [state.modalYearIsOpen, state.currentYear]);
    /**
     * Private
     */
    function clickHandler(e) {
        useStore.setState({ modalYearIsOpen: !isOpen, currentYear: e.target.textContent });
        navigate(`/${ e.target.textContent }`);
    }

    return (
        <li className="list-item-year">
            <button className={ `button button-year h4 ${ year ===  currentYear ? 'is-active' : '' }` } onClick={ clickHandler }>
                { year }
            </button>
        </li>
    );
}

export default ListItemYear;
