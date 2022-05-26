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
    const { categorySlug, entities } = props;

    return (
        <ul className="list-entities">

            {
                entities.map((entity, index) => {
                    return (
                        <li className="list-item" key={ index }>
                            <ButtonEntity className="heading-list-subcategory" categorySlug={ categorySlug } entity={ entity } />
                        </li>
                    );
                })
            }

        </ul>
    );
}

export default ListEntities;
