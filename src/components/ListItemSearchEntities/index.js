// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function ListItemSearchEntities(props) {
    return (
        <li className="list-item-search-entities">

            <Link to={ props.item.slug } className="link-search p4">
                { props.item.name }
            </Link>

        </li>
    );
}

export default ListItemSearchEntities;
