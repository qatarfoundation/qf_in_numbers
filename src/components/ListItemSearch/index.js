// React
import React, { useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import ListEntities from '@/components/ListEntities';

// Hooks
import useStore from '@/hooks/useStore';

function ListItemSearch(props) {
    /**
     * Data
     */
    const { item } = props;
    /**
     * Store
     */
    const isOpen = useStore((state) => state.modalSearchIsOpen);
    /**
     * Private
     */
    function clickHandler(e) {
        useStore.setState({ modalSearchIsOpen: !isOpen });
    }

    return (
        <li className="list-item-search">
            <Link to={ item.slug } className='link-search p4' onClick={ clickHandler }>
                { item.value }
            </Link>
        </li>
    );
}

export default ListItemSearch;
