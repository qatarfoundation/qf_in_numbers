// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonCategory from '@/components/ButtonCategory';

const ListCategories = (props, ref) => {
    return (
        <ul className="list-categories">

            <li className="list-item">

                <ButtonCategory category={ { name: 'Community', path: 'community' } }></ButtonCategory>

            </li>

            <li className="list-item">

                <ButtonCategory category={ { name: 'Research', path: 'research' } }></ButtonCategory>

            </li>

            <li className="list-item">

                <ButtonCategory category={ { name: 'Education', path: 'education' } }></ButtonCategory>

            </li>

        </ul>
    );
};

export default ListCategories;
