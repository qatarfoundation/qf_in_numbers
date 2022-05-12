// React
import React, { useState } from 'react';

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
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalYearIsOpen: !isOpen });
    }

    return (
        <>
            <div className="modal modal-year">
                <ButtonModal name={ currentYear } onClick={ clickHandler }  />
                { isOpen ? <PanelYear isOpen={ isOpen } /> : '' }
            </div>
        </>
    );
}

export default ModalYear;
