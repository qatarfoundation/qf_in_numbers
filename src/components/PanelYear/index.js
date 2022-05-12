// React
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import ListYears from '@/components/ListYears';
import Scrollbar from '@/components/ScrollBar';

// Hooks
import useStore from '@/hooks/useStore';

function PanelYear(props, ref) {
    /**
     * Store
     */
    const isOpen = useStore((state) => state.modalYearIsOpen);
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
    years.reverse();
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalYearIsOpen: !isOpen });
    }
    return (
        <>
            <div className="panel panel-year" data-name="year">
                <div className="header">
                    <p className='label h8'>Year selection</p>
                    <ButtonClose onClick={ clickHandler } />
                </div>
                <Scrollbar revert={ false }>
                    <ListYears years={ years } />
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelYear;
