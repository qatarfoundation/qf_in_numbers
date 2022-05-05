// React
import React, { useState } from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonModal from '@/components/ButtonModal';
import PanelSearch from '@/components/PanelSearch';

// Hooks
import useStore from '@/hooks/useStore';

function ModalSearch(props, ref) {
    /**
     * Store
     */
    const [isOpen] = useStore((state) => [state.modalSearchIsOpen]);
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalSearchIsOpen: !isOpen });
    }

    return (
        <>
            <div className="modal modal-year">
                <ButtonModal name="Find data" onClick={ clickHandler }  />
                { isOpen ? <PanelSearch isOpen={ isOpen } /> : '' }
            </div>
        </>
    );
}

export default ModalSearch;