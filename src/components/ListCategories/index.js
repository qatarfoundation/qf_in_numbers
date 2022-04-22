// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonCategory from '@/components/ButtonCategory';

function ListCategories(props, ref) {
    /**
     * Data
     */
    const { categories } = props;

    return (
        <ul className="list-categories">

            <li className="list-item">

                <ButtonCategory category={ { name: categories.community.name, path: 'community' } }></ButtonCategory>

            </li>

            <li className="list-item">

                <ButtonCategory category={ { name: categories.research.name, path: 'research' } }></ButtonCategory>

            </li>

            <li className="list-item">

                <ButtonCategory category={ { name: categories.education.name, path: 'education' } }></ButtonCategory>

            </li>

        </ul>
    );
}

export default ListCategories;
