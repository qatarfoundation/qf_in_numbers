import React from 'react';
import { useInView } from 'react-intersection-observer';

// CSS
import './style.scoped.scss';

function FadeInWrapper({ children }) {
    const { ref, inView } = useInView();
    return <div className={ 'fadein-container ' + inView ? 'visible' : '' } ref={ ref }>{ children }</div>;
}

export default FadeInWrapper;