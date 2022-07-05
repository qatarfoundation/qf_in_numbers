// React
import React from 'react';

// CSS
import './style.scoped.scss';

function ButtonModal(props, ref) {
    return (
        <button onClick={ props.onClick } className="button button-modal heading-dropdown">

            <span className='text text-init'>{ props.name }</span>
            <span className='text text-hover'>{ props.name }</span>
            <span className='arrow arrow-init' />
            <span className='arrow arrow-hover' />
            <span className='line line-init' />
            <span className='line line-hover' />

        </button>
    );
}

export default ButtonModal;
