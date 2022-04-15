// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSubcategories from '@/components/ListItemSubcategories';

// Components

function ListSubcategories(props, ref) {
    const { year, category, subcategories } = props;

    return (
        <ul className="list-subcategories">

            {
                subcategories.map((subcategory, index) => {
                    return <ListItemSubcategories key={ index } year={ year } category={ category } subcategory={ subcategory } />;
                })
            }

        </ul>
    );
}

export default ListSubcategories;
