// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import SideBreadcrumbItem from '@/components/SideBreadcrumbItem';

function SideBreadcrumbs(props) {
    return (
        <div className="side-breadcrumbs">

            <SideBreadcrumbItem name={ props.year.year } path={ props.year.slug } />

            <SideBreadcrumbItem name={ props.category.name } path={ props.category.slug } />

        </div>
    );
}

export default SideBreadcrumbs;
