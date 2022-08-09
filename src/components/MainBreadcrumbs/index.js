// React
import React, { useState } from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import MainBreadcrumbItem from '@/components/MainBreadcrumbItem';

function MainBreakcrumbs(props) {
    /**
     * Data
     */
    const { language } = useI18next();

    const currentCategory = props.pageContext.category ? props.pageContext.category[language] : null;
    const currentSubcategory = props.pageContext.subcategory ? props.pageContext.subcategory[language] : null;

    return (
        <div className={ 'main-breadcrumbs' }>

            { currentCategory && <MainBreadcrumbItem name={ currentCategory.name } path={ currentCategory.slug } /> }

            { currentSubcategory && <MainBreadcrumbItem name={ currentSubcategory.name } path={ currentSubcategory.slug } /> }

        </div>
    );
}

export default MainBreakcrumbs;
