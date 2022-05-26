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
    const { category, subcategory } = props;
    const categorySlug = category.slug;

    /**
     * States
     */
    const [currentCategory, currentSubcategory] = useStore((state) => [state.currentCategory, state.currentSubcategory]);
    const [isOpen, setOpen] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const { language, path } = useI18next();

    /**
     * Private
     */
    function updateHistoryState() {
        const prefix = language === 'en-US' ? '' : `/${ language }`;
        const slug = `${ prefix }${ subcategory.slug }`;
        window.history.replaceState({}, null, slug);
    }

    function clickHandler() {
        useStore.setState({ currentCategory: category });
        useStore.setState({ currentSubcategory: subcategory });
        const slug = categorySlug.split('/').slice(-1)[0];
        Globals.webglApp.gotoSubcategory(slug, subcategory.name);
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
        } else {
            setOpen(false);
        }
    }, [currentCategory, currentSubcategory]);

    return (
        <li className="list-item-subcategory">

            <button className={ `button heading-list-category ${ isOpen || isHovered ? 'is-highlighted' : '' }` } onClick={ clickHandler } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>
                { subcategory.name }
            </button>

            { isOpen && <ListEntities categorySlug={ categorySlug } entities={ subcategory.entities } /> }

        </li>
    );
}

export default ListItemSubcategory;
