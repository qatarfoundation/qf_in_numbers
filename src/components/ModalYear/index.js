// React
import React, { useEffect, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { graphql, useStaticQuery } from 'gatsby';

// CSS
import './style.scoped.scss';

// Components
import ButtonModal from '@/components/ButtonModal';
import PanelYear from '@/components/PanelYear';

// Hooks
import useStore from '@/hooks/useStore';

function ModalYear(props, ref) {
    /**
     * Store
     */
    const [isOpen, currentYear] = useStore((state) => [state.modalYearIsOpen, state.currentYear]);
    /**
      * Datas
      */
    const data = useStaticQuery(graphql`
         query {
             allContentfulYear {
                 edges {
                     node {
                         year
                         node_locale
                     }
                 }
             }
         }
     `);
    const years = data.allContentfulYear.edges;
    years.sort((a, b) => b.node.year - a.node.year);
    useEffect(() => {
        useStore.setState({ currentYear: years[0].node.year });
    }, []);
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalYearIsOpen: !isOpen });
    }

    return (
        <>
            <div className="modal modal-year">
                <ButtonModal name={ currentYear } onClick={ clickHandler }  />
                { isOpen ? <PanelYear isOpen={ isOpen } years={ years } /> : '' }
            </div>
        </>
    );
}

export default ModalYear;
