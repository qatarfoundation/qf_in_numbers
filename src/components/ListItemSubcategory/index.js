// React
import React, { useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';

// Components
import ListEntities from '@/components/ListEntities';

function ListItemSubcategory(props) {
    /**
     * Data
     */
    const { categoryName, subcategory } = props;

    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const { language, navigate } = useI18next();

    /**
     * Private
     */
    function updateHistoryState() {
        const prefix = language === 'en-US' ? '' : `/${ language }`;
        const slug = `${ prefix }${ subcategory.slug }`;
        window.history.replaceState({}, null, slug);
    }

    function clickHandler() {
        Globals.webglApp.gotoSubcategory(categoryName, subcategory.name);
        TreeDataModel.setSubcategory(subcategory.name);
        updateHistoryState();
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

            { isOpen && <ListEntities categoryName={ categoryName } entities={ subcategory.entities } /> }

        </li>
    );
}

export default ListItemSubcategory;
