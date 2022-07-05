// React
import React from 'react';

// CSS
import './style.scoped.scss';

function ButtonClose(props, ref) {
    return (
        <button { ...props } className="button button-close">
            <span className="line line-left" />
            <span className="line line-right" />
        </button>
    );
}

export default ButtonClose;
