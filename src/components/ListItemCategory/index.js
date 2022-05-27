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

function ListItemCategory(props) {
    /**
     * Data
     */
    const { category } = props;
    const categorySlug = category.slug;

    /**
     * States
     */
    const [currentCategory] = useStore((state) => [state.currentCategory]);
    const [isOpen, setOpen] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const { language, path } = useI18next();

    /**
     * Private
     */
    function updateHistoryState() {
        const prefix = language === 'en-US' ? '' : `/${ language }`;
        const slug = `${ prefix }${ category.slug }`;
        window.history.replaceState({}, null, slug);
    }

    function clickHandler(e) {
        useStore.setState({ currentCategory: category });
        // const slug = categorySlug.split('/').slice(-1)[0];
        // Globals.webglApp.gotoCategory(slug, category.name);
        // TreeDataModel.setCategory(category.name);
        // updateHistoryState();
        setOpen(!isOpen);
    }

    function mouseenterHandler() {
        setHovered(true);
    }

    function mouseleaveHandler() {
        setHovered(false);
    }

    useEffect(() => {
        if (currentCategory) {
            setOpen(category.slug === currentCategory.slug);
        } else {
            setOpen(false);
        }
    }, [currentCategory]);

    return (
        <div className="list-item-category">
            <button className={ `button heading-list-category ${ isOpen || isHovered ? 'is-highlighted' : '' }` } onClick={ clickHandler } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>
                { category.name }
            </button>
        </div>
    );
}

export default ListItemCategory;
