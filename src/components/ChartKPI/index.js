// React
import React, { useEffect, useRef, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

function ChartKPI(props, ref) {
    /**
     * Datas
     */
    const { chart } = props;
    const data = chart.fields;
    return (
        <div className="chart-kpi section-container">
            <div className="main">
                <div className="item">
                    <div className="item-head">
                        { data[0].icon && <div className='icon' dangerouslySetInnerHTML={ { __html: data[0].icon } } /> }
                        <p className="p6 label">{ data[0].name }</p>
                    </div>
                    <p className="h2 title">{ data[0].value }</p>
                    { data[0].additionalInformation && <p className="p6 additional">{ data[0].additionalInformation }</p> }
                </div>
            </div>
            <div className="second">
                {
                    data.map((d, i) => {
                        return i !== 0 && <div key={ i } className="item">
                            <div className="item-head">
                                { d.icon && <div className='icon' dangerouslySetInnerHTML={ { __html: d.icon } } /> }
                                <p className="p6 label">{ d.name }</p>
                            </div>
                            <p className="h4 title">{ d.value }</p>
                            { d.additionalInformation && <p className="p6 additional">{ d.additionalInformation }</p> }
                        </div>;
                    })
                }
            </div>
        </div>
    );
}

export default ChartKPI;
