// React
import React from 'react';

// CSS
import './style.scoped.scss';

function ButtonModal(props, ref) {
    return (
        <button { ...props } className="button button-modal heading-dropdown">{ props.name }<span className='line' /></button>
    );
}

export default ButtonModal;
