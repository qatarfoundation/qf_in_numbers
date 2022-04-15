// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

const ButtonCategory = (props, ref) => {
    const { category } = props;
    const { originalPath } = useI18next();

    return (
        <>
            <Link className="button button-category" to={ `${originalPath}/${category.path}` }>
                { category.name }
            </Link>
        </>
    );
};

export default ButtonCategory;
