import React from 'react';
import { useInView } from 'react-intersection-observer';

// CSS
import './style.scoped.scss';

function FadeInWrapper({ children, threshold = 0.5 }) {
    const { ref, inView } = useInView({ threshold });
    return (
        <div
            className={ 'fadein-container' + (inView ? ' visible' : '') }
            ref={ ref }
        >
            { children }
        </div>
    );
}

export default FadeInWrapper;
