// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonEntity from '@/components/ButtonEntity/index';

function ListEntities(props) {
    /**
     * Data
     */
    const { entities } = props;

    return (
        <ul className="list-entities">

            {
                entities.map((entity, index) => {
                    return (
                        <li className="list-item" key={ index }>
                            <ButtonEntity name={ entity.name } />
                        </li>
                    );
                })
            }

        </ul>
    );
}

export default ListEntities;
