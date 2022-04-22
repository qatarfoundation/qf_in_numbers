// React
import React, { useState } from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListEntities from '@/components/ListEntities';

function ListItemSubcategories(props, ref) {
    /**
     * Data
     */
    const { year, category, currentSubcategory, subcategory } = props;

    /**
     * States
     */
    const [isOpen, setOpen] = useState(currentSubcategory && currentSubcategory.slug === subcategory.slug);
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
}

export default ListItemSubcategories;
