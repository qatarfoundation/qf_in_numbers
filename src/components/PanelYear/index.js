// React
import React from 'react';

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
    const years = ['2022', '2021', '2020', '2022', '2021', '2020', '2022', '2021', '2020', '2022', '2021', '2020', '2022', '2021', '2020', '2022', '2021', '2020'];
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalYearIsOpen: !isOpen });
    }
    return (
        <>
            <div className="panel panel-year">
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
