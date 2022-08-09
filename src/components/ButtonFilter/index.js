// React
import React from 'react';

// CSS
import './style.scoped.scss';

function ButtonFilter(props, ref) {
    return (
        <button onClick={ props.onClick } data-type={ props.type } className={ `button button-filter ${ props.active ? 'is-active' : ''  }` }>

            <span>{ props.name }</span>

            <div className="border"></div>

        </button>
    );
}

export default ButtonFilter;
