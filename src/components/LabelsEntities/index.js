// React
import React, { useRef } from 'react';

// CSS
import './style.scoped.scss';

function LabelsEntities(props) {
    const { entities } = props;

    const itemsRef = useRef([]);

    return (
        <ul>
            {
                entities.map((entity, index) => {
                    return (
                        <li key={ index } ref={ el => itemsRef.current[index] = el }>
                            <span>{ entity.name }</span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default LabelsEntities;
