import React from 'react';
import { InView } from 'react-intersection-observer';

// CSS
import './style.scoped.scss';

function FadeInWrapper({
    as = 'div',
    className = '',
    threshold = 0.5,
    children,
    ...props
}) {
    return (
        <InView
            as={ as }
            threshold={ threshold }
            className={ className + ' fadein-container' }
            onChange={ (inView, entry) =>
                entry.target.classList.toggle('visible', inView)
            }
            { ...props }
        >
            { children }
        </InView>
    );
}

export default FadeInWrapper;
