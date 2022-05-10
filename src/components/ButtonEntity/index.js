// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

function ButtonEntity(props) {
    const { categoryName, entity } = props;

    function clickHandler() {
        Globals.webglApp.gotoEntity(categoryName, entity.name);
        Globals.tree.selectedEntity = entity;
    }

    return (
        <button className="button button-entity" onClick={ clickHandler }>{ entity.name }</button>
    );
}

export default ButtonEntity;
