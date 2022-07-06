// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSearchEntities from '@/components/ListItemSearchEntities';

function ListSearchEntities(props, ref) {
    /**
     * Data
     */
    const { items } = props;

    return (
        <ul className="list-search-entities">
            {
                items.map((item, index) => {
                    return <ListItemSearchEntities key={ index } item={ item } />;
                })
            }
        </ul>
    );
}

export default ListSearchEntities;
