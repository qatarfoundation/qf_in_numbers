// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSearch from '@/components/ListItemSearch';

function ListSearch(props, ref) {
    /**
     * Data
     */
    const { items } = props;

    return (
        <ul className="list-search">
            {
                items.map((item, index) => {
                    return <ListItemSearch
                        key={ index }
                        item={ item }
                    />;
                })
            }
        </ul>
    );
}

export default ListSearch;
