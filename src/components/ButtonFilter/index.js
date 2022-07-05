// React
import React from 'react';

// Hooks
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

function ButtonFilter(props, ref) {
    return (
        <button onClick={ props.onClick } data-type={ props.type } className={ `button button-filter h9 ${ props.active ? 'is-active' : ''  }` }>

            <span>{ props.name }</span>

            <div className="border"></div>

        </button>
    );
}

export default ButtonFilter;
