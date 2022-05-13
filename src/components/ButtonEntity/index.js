// React
import React, { useEffect, useState } from 'react';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Hooks
import useStore from '@/hooks/useStore';

function ButtonEntity(props) {
    const { categoryName, entity } = props;

    function clickHandler() {
        Globals.webglApp.gotoEntity(categoryName, entity.name);
        useStore.setState({ selectedEntity: entity });
    }

    const [isSelected, setIsSelected] = useState();

    const selectedEntity = useStore((state) => state.selectedEntity);

    useEffect(() => {
        setIsSelected(entity === selectedEntity);
    }, [selectedEntity]);

    return (
        <button className={ `button button-entity ${ isSelected ? 'selected' : '' }` } onClick={ clickHandler }>{ entity.name }</button>
    );
}

export default ButtonEntity;
