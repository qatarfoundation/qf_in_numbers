// React
import React, { useEffect, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { graphql, useStaticQuery } from 'gatsby';

// CSS
import './style.scoped.scss';

// Components
import ButtonModal from '@/components/ButtonModal';
import PanelSubcategories from '@/components/PanelSubcategories';
import ListIcon from '@/assets/icons/list.svg';

// Hooks
import useStore from '@/hooks/useStore';

function ModalSubcategories(props, ref) {
    /**
     * Store
     */
    const [isOpen] = useStore((state) => [state.modalSubcategoriesIsOpen]);
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalSubcategoriesIsOpen: !isOpen });
    }

    return (
        <>
            <div className="modal modal-subcategories">
                <button className='button button-list' onClick={ clickHandler }>
                    <ListIcon />
                </button>
                { isOpen ? <PanelSubcategories isOpen={ isOpen } subcategories={ props.subcategories } /> : '' }
            </div>
        </>
    );
}

export default ModalSubcategories;
