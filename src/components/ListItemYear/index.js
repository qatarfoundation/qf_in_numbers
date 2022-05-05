// React
import React, { useState } from 'react';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import ListEntities from '@/components/ListEntities';

// Hooks
import useStore from '@/hooks/useStore';

function ListItemYear(props) {
    /**
     * Data
     */
    const { year } = props;
    /**
     * Store
     */
    const [isOpen, currentYear] = useStore((state) => [state.modalYearIsOpen, state.currentYear]);
    /**
     * Private
     */
    function clickHandler(e) {
        useStore.setState({ modalYearIsOpen: !isOpen, currentYear: e.target.textContent });
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
