// React
import React, { useState } from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListEntities from '@/components/ListEntities';

const ListItemSubcategories = (props, ref) => {
    const { year, category, subcategory } = props;

    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);
    const [isHovered, setHovered] = useState(false);

    /**
     * Private
     */
    function clickHandler() {
        setOpen(!isOpen);
    }

    function mouseenterHandler() {
        setHovered(true);
    }

    function mouseleaveHandler() {
        setHovered(false);
    }

    return (
        <li className="list-item-subcategories">

            <button className={ `button ${isOpen || isHovered ? 'is-highlighted' : ''}` } onClick={ clickHandler } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>
                { subcategory.name }
            </button>

            {
                isOpen && <ListEntities year={ year } category={ category } subcategory={ subcategory } entities={ subcategory.entities } />
            }

        </li>
    );
};

export default ListItemSubcategories;
