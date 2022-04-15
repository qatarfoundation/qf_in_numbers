// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function ListEntities(props, ref) {
    const { year, category, subcategory, entities } = props;

    console.log(year, category);

    const options = useI18next();
    const { originalPath } = useI18next();

    return (
        <ul className="list-entities">

            {
                entities.map((entity, index) => {
                    const path = `/${year.year}/${category.slug}/${subcategory.slug}/${entity.slug}`;
                    return (
                        <li className="list-item" key={ index }>
                            <Link className="button button-entity" to={ path }>
                                { entity.name }
                            </Link>
                        </li>
                    );
                })
            }

        </ul>
    );
}

export default ListEntities;
