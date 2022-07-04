// React
import React, { useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import MainBreadcrumbItem from '@/components/MainBreadcrumbItem';

// Hooks
import useStore from '@/hooks/useStore';

function MainBreakcrumbs(props) {
    /**
     * Props
     */

    /**
     * Store
     */
    const currentCategory = useStore((state) => state.currentCategory);
    const currentSubcategory = useStore((state) => state.currentSubcategory);

    return (
        <div className={ 'main-breadcrumbs' }>

            { currentCategory && <MainBreadcrumbItem name={ currentCategory.name } path={ currentCategory.slug } /> }

            { currentSubcategory && <MainBreadcrumbItem name={ currentSubcategory.name } path={ currentSubcategory.slug } /> }

        </div>
    );
}

export default MainBreakcrumbs;
