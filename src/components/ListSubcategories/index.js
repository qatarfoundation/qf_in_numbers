// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSubcategories from '@/components/ListItemSubcategories';

// Components

function ListSubcategories(props, ref) {
    /**
     * Data
     */
    const { year, category, subcategory, subcategories } = props;

    return (
        <ul className="list-subcategories">

            {
                subcategories.map((item, index) => {
                    return <ListItemSubcategories
                        key={ index }
                        year={ year }
                        category={ category }
                        currentSubcategory={ subcategory }
                        subcategory={ item.fields }
                    />;
                })
            }

        </ul>
    );
}

export default ListSubcategories;
