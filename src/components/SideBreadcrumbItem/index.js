// React
import React, { useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function MainBreakcrumbItem(props) {
    /**
     * Props
     */
    const { name, path } = props;

    return (
        <div className="side-breadcrumb-item">

            <div className="icon"></div>

            <Link className="button" to={ path }>
                { name }
            </Link>

        </div>
    );
}

export default MainBreakcrumbItem;
