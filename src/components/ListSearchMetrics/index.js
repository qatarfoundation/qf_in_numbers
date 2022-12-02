// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSearchMetrics from '@/components/ListItemSearchMetrics';

function ListSearchMetrics(props) {
    /**
     * Data
     */
    const { items } = props;

    return (
        <ul className="list-search-entities">
            {
                items.map((item, index) => {
                    return <ListItemSearchMetrics key={ index } item={ item } />;
                })
            }
        </ul>
    );
}

export default ListSearchMetrics;
