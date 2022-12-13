// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Hooks
import useStore from '@/hooks/useStore';

function ListItemSubcategories(props) {
    const { category, subcategory } = props;

    const activeSubcategory = useStore((state) => state.activeSubcategory);
    const isActive = activeSubcategory?.uuid === subcategory.uuid;

    function buttonCategoryClickHandler() {
        useStore.setState({ activeSubcategory: subcategory });
        Globals.webglApp.gotoSubcategory(category.id, subcategory.id);
        history.pushState({}, '', subcategory.slug);
    }

    return (
        <li className={ `item ${ isActive ? 'is-active' : '' }` }>
            <button className="button button-category" onClick={ buttonCategoryClickHandler }>{ subcategory.name }</button>
            <ul className="list-entities">
                {
                    subcategory.entities.map((entity, index) => {
                        return (
                            <li key={ index }>
                                <Link to={ entity.slug } className="button button-entity">{ entity.name }</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </li>
    );
}

export default ListItemSubcategories;
