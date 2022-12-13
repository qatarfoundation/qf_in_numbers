// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function ButtonMenu() {
    const isModalMenuOpen = useStore((state) => state.isModalMenuOpen);

    function clickHandler() {
        useStore.setState({ isModalMenuOpen: !isModalMenuOpen });
    }

    return (
        <button className="button button-menu" onClick={ clickHandler }>
            <div className="line line--top"></div>
            <div className="line line--bottom"></div>
        </button>
    );
}

export default ButtonMenu;
