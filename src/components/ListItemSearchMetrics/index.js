// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Helpers
import getChartAnchor from '@/utils/helpers/getChartAnchor';
import getChartTitle from '@/utils/helpers/getChartTitle';

function ListItemSearchMetrics(props) {
    return (
        <li className="list-item-search-entities">
            <Link to={ `${ props.item.entity.slug }#${ getChartAnchor(props.item.chart) }` } className="link-search p4">
                <span className="entity">{ props.item.entity.name }</span>
                <span className="metric">{ getChartTitle(props.item.chart) }</span>
            </Link>
        </li>
    );
}

export default ListItemSearchMetrics;
