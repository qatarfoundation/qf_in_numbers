// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ArrowLong from '@/assets/icons/arrow-long.svg';

function ButtonScroll(props, ref) {
    return (
        <button { ...props } className={ `button button-scroll p4 ${ props.className }` }>
            <div className="icon icon-arrow">
                <ArrowLong className='arrow arrow-init' />
                <ArrowLong className='arrow arrow-hover' />
            </div>
            <p className='p3'>{ props.children }</p>
        </button>
    );
}

export default ButtonScroll;
