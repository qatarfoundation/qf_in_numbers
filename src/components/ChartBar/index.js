// React
import React from 'react';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

function ChartBar(props) {
    /**
     * Data
     */
    const { chart } = props;
    const data = calcBarWidth(chart.fields);

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    /**
     * Private
     */
    function calcBarWidth(data) {
        const maxValue = Math.max(...data.map(o => o.value));
        data.map((item) => {
            item.barSize = (item.value / maxValue) * 100;
        });
        return data;
    }

    function resize() {
    }

    return (
        <ul className="chart">
            {
                data.map((item, index) => {
                    return (
                        <li key={ index }>
                            <span className="p4 label">{ item.name }</span>
                            <div className="value">
                                <div className="value__bar" style={ { width: `${ item.barSize }%` } }></div>
                                <div className="value__label">
                                    <div className="value__text">{ item.value }</div>
                                    {
                                        item.additionalInformation && (
                                            <div className="value__info">{ item.additionalInformation }</div>
                                        )
                                    }
                                </div>
                            </div>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default ChartBar;
