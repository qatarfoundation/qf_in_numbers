// React
import React, { useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function ListItemSearchTags(props) {
    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);

    /**
     * Handlers
     */
    function clickHandler() {
        setOpen(!isOpen);
    }

    return (
        <li className={ `list-item-search-tags ${ isOpen ? 'is-open' : '' }` }>

            <button className="button tag p4" onClick={ clickHandler }>

                <span>{ props.tag.name }</span>

                <div className="icon"></div>

            </button>

            <ul className="list-entities">

                {
                    props.tag.entities.map((item, i) => {
                        return (
                            <li key={ i } className="list-item-entities">
                                <Link to={ item.slug } className="link-entity p4">
                                    { item.name }
                                </Link>
                            </li>
                        );
                    })
                }

            </ul>

        </li>
    );
}

export default ListItemSearchTags;
