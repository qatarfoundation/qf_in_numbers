// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

function ButtonEntity(props) {
    function clickHandler() {
        Globals.webglApp.gotoEntity(props.name);
    }

    return (
        <button className="button button-entity" onClick={ clickHandler }>{ props.name }</button>
    );
}

export default ButtonEntity;
