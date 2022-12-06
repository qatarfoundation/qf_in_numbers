// React
import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// CSS
import './style.scoped.scss';

function ChartText(props) {
    /**
     * Data
     */
    const { chart } = props;

    return (
        <div className="chart">
            { documentToReactComponents(chart.fields.description) }
        </div>
    );
}

export default ChartText;
