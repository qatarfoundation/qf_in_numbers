// React
import React, { useEffect, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';

// Components
import ListEntities from '@/components/ListEntities';

// Hooks
import useStore from '@/hooks/useStore';

function ListItemSubcategory(props) {
    /**
     * Data
     */
    const { categoryName, subcategory } = props;

    /**
     * States
     */
    const currentSubcategory = useStore((state) => state.currentSubcategory);
    const [isOpen, setOpen] = useState();
    const [isHovered, setHovered] = useState(false);
    const { language } = useI18next();

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
        useStore.setState({ selectedEntity: null });
    }

    function mouseenterHandler() {
        setHovered(true);
    }

    function mouseleaveHandler() {
        setHovered(false);
    }

    useEffect(() => {
        if (currentSubcategory) {
            setOpen(subcategory.slug === currentSubcategory.slug);
        }
    }, [currentSubcategory]);

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
