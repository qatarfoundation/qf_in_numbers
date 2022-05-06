// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonArrow(props, ref) {
    return (
        <button { ...props } className={ `button button-arrow ${ props.className }` }>
            <Arrow className={ `arrow ${ props.direction }` } />
        </button>
    );
}

export default ButtonArrow;
