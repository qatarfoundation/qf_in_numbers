// React
import React from 'react';

// Hooks
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

function ButtonFilter(props, ref) {
    /**
     * Store
     */
    const filterType = useStore((state) => state.filterType);
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ filterType: props.type });
    }
    return (
        <button className={ `button button-filter h9 ${ props.type == filterType ? 'is-active' : ''  }` } onClick={ clickHandler }>{ props.name }</button>
    );
}

export default ButtonFilter;
