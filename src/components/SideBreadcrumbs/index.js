// React
import React, { useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import SideBreadcrumbItem from '@/components/SideBreadcrumbItem';

// Hooks
import useStore from '@/hooks/useStore';

function SideBreadcrumbs(props) {
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

            <SideBreadcrumbItem name={ currentCategory.name } path={ currentCategory.slug } />

            <SideBreadcrumbItem name={ currentSubcategory.name } path={ currentSubcategory.slug } />

        </div>
    );
}

export default SideBreadcrumbs;
