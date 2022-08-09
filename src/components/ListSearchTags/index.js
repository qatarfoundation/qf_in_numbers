// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSearchTags from '@/components/ListItemSearchTags';

function ListSearchTags(props, ref) {
    /**
     * Data
     */
    const { items } = props;

    return (
        <ul className="list-search-tags">
            {
                items.map((item, index) => {
                    return <ListItemSearchTags key={ index } tag={ item } />;
                })
            }
        </ul>
    );
}

export default ListSearchTags;
