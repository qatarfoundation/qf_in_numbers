// React
import React from 'react';

// CSS
import './style.scoped.scss';

function Scrollbar({ revert = false, colored = true, ...props }, ref) {
    return (
        <>
            <div className={ `scrollbar ${ revert ? 'scrollbar-revert' : '' } ${ colored ? 'scrollbar-colored' : '' }` }>
                { props.children }
            </div>
        </>
    );
}

export default Scrollbar;
