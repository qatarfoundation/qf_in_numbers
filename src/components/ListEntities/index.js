// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonEntity from '@/components/ButtonEntity';

function ListEntities(props) {
    /**
     * Data
     */
    const { categoryName, entities } = props;

    return (
        <ul className="list-entities">

            {
                entities.map((entity, index) => {
                    return (
                        <li className="list-item" key={ index }>
                            <ButtonEntity categoryName={ categoryName } entity={ entity } />
                        </li>
                    );
                })
            }

        </ul>
    );
}

export default ListEntities;
