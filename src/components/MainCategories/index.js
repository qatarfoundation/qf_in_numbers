// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonMainCategory from '@/components/MainCategoryLabel/index';

const MainCategories = () => {
    return (
        <ul>
            <li>
                <ButtonMainCategory label="Community" to="community" index="0" />
            </li>
            <li>
                <ButtonMainCategory label="Research" to="research" index="1" />
            </li>
            <li>
                <ButtonMainCategory label="Education" to="education" index="2" />
            </li>
        </ul>
    );
};

export default MainCategories;
