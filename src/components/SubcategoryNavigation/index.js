// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemSubcategories from '@/components/ListItemSubcategories';

function SubcategoryNavigation(props) {
    const { category, subcategories } = props;

    return (
        <div className="subcategory-navigation">
            <ul className="list-subcategories">
                {
                    subcategories.map((subcategory, index) => {
                        return <ListItemSubcategories key={ index } category={ category } subcategory={ subcategory } />;
                    })
                }
            </ul>
        </div>
    );
}

export default SubcategoryNavigation;
