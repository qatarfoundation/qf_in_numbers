// React
import React from 'react';

// CSS
import './style.scoped.scss';

function Scrollbar(props, ref) {
    return (
        <>
            <div className={ `scrollbar ${ props.revert ? 'scrollbar-revert' : '' }` }>
                { props.children }
            </div>
        </>
    );
}

export default Scrollbar;
