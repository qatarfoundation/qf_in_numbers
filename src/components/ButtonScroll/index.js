// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonScroll(props, ref) {
    return (
        <button { ...props } className={ `button button-scroll p4 ${ props.className }` }>
            <div className="icon icon-arrow">
                <Arrow className='arrow' />
            </div>
            <p className='p3'>{ props.children }</p>
        </button>
    );
}

export default ButtonScroll;
