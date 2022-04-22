// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function ListEntities(props, ref) {
    /**
     * Data
     */
    const { year, category, subcategory, entities } = props;

    return (
        <ul className="list-entities">

            {
                entities.map((entity, index) => {
                    const path = `/${year.year}/${category.slug}/${subcategory.slug}/${entity.fields.slug}`;
                    return (
                        <li className="list-item" key={ index }>
                            <Link className="button button-entity" to={ path }>
                                { entity.fields.name }
                            </Link>
                        </li>
                    );
                })
            }

        </ul>
    );
}

export default ListEntities;
