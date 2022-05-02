// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSubcategory from '@/components/ListItemSubcategory';

// Components

function ListSubcategories(props, ref) {
    /**
     * Data
     */
    const { subcategories } = props;

    return (
        <ul className="list-subcategories">

            {
                subcategories.map((item, index) => {
                    return <ListItemSubcategory
                        key={ index }
                        subcategory={ item }
                    />;
                })
            }

        </ul>
    );
}

export default ListSubcategories;
