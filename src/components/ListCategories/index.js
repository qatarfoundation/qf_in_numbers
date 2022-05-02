// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import LabelMainCategory from '@/components/LabelMainCategory';

function ListCategories(props) {
    /**
     * Data
     */
    const { categories } = props;

    return (
        <ul className="list-categories">

            <li className="list-item">

                <LabelMainCategory index="0" label={ categories[0].name } anchor="left" />

            </li>

            <li className="list-item">

                <LabelMainCategory index="1" label={ categories[1].name } anchor="left" />

            </li>

            <li className="list-item">

                <LabelMainCategory index="2" label={ categories[2].name } anchor="right" />

            </li>

        </ul>
    );
}

export default ListCategories;
