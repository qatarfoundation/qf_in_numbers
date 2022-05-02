// React
import React, { useState } from 'react';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import ListEntities from '@/components/ListEntities';

function ListItemSubcategory(props) {
    /**
     * Data
     */
    const { subcategory } = props;

    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);
    const [isHovered, setHovered] = useState(false);

    /**
     * Private
     */
    function clickHandler() {
        Globals.webglApp.gotoSubcategory(subcategory.name);
        setOpen(!isOpen);
    }

    function mouseenterHandler() {
        setHovered(true);
    }

    function mouseleaveHandler() {
        setHovered(false);
    }

    return (
        <li className="list-item-subcategory">

            <button className={ `button ${ isOpen || isHovered ? 'is-highlighted' : '' }` } onClick={ clickHandler } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>
                { subcategory.name }
            </button>

            { isOpen && <ListEntities entities={ subcategory.entities } /> }

        </li>
    );
}

export default ListItemSubcategory;
