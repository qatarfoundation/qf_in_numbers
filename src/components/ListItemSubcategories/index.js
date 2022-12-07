// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function ListItemSubcategories(props) {
    const { subcategory, index } = props;

    const subcategoryNavigationActiveIndex = useStore((state) => state.subcategoryNavigationActiveIndex);
    const isActive = subcategoryNavigationActiveIndex === index;

    function buttonCategoryClickHandler() {
        useStore.setState({ subcategoryNavigationActiveIndex: index });
    }

    return (
        <li className={ `item ${ isActive ? 'is-active' : '' }` }>
            <button className="button button-category" onClick={ buttonCategoryClickHandler }>{ subcategory.name }</button>
            <ul className="list-entities">
                {
                    subcategory.entities.map((entity, index) => {
                        return (
                            <li key={ index }>
                                <button className="button button-entity">{ entity.name }</button>
                            </li>
                        );
                    })
                }
            </ul>
        </li>
    );
}

export default ListItemSubcategories;
