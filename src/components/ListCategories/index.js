// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import LabelMainCategory from '@/components/LabelMainCategory';

function ListCategories(props, ref) {
    /**
     * Data
     */
    const { categories } = props;

const ListCategories = () => {
    return (
        <ul className="list-categories">

            <li className="list-item">

                <LabelMainCategory index="0" label={ categories.community.name } anchor="left" />

            </li>

            <li className="list-item">

                <LabelMainCategory index="1" label={ categories.research.name } anchor="left" />

            </li>

            <li className="list-item">

                <LabelMainCategory index="2" label={ categories.education.name } anchor="right" />

            </li>

        </ul>
    );
};

export default ListCategories;
