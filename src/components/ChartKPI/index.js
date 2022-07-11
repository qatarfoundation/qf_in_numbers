// React
import React, { useEffect, useRef, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';
import useStore from '@/hooks/useStore';

function ChartKPI(props, ref) {
    /**
     * Datas
     */
    const maxLength = 42;
    const { chart } = props;
    const data = chart.fields;
    chart.lastYearFields = chart.fields;
    // !!! Ask to Leo to get the last year value from each KPI chart
    // data[0].lastYearValue = 120;
    /**
     * Store
     */
    const currentYear = useStore((state) => state.currentYear);
    /**
     * References
     */
    const tooltipRef = useRef();
    /**
     * Private
     */
    function additionnalField(i) {
        const diff = (data[i].value - data[i].lastYearValue) % data[i].lastYearValue * 100;
        let result = '';
        if (diff == 0) return;
        else if (diff > 0) result += '+';
        return `${ result }${ diff }% from ${ currentYear - 1 }`;
    }
    function trimmedText(text) {
        if (text.length > maxLength) {
            let trimmedString = text.substr(0, maxLength);
            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
            trimmedString = trimmedString == '' ? text.split(' ')[0] : trimmedString;
            return trimmedString + '\u00a0...';
        } else {
            return text;
        }
    }

    function mouseover(e) {
        if (!e.target.classList.contains('can-hover')) return
        tooltipRef.current.innerHTML = `<p class="p6">${ e.target.dataset.text }</p>`;
        tooltipRef.current.style.left = `${ e.target.offsetLeft + e.target.offsetWidth / 2 }px`;
        tooltipRef.current.style.top = `${ e.target.offsetTop - 5 }px`;
        tooltipRef.current.style.opacity = 1
    }
    function mouseleave(e) { e.target.classList.contains('can-hover') && tooltipRef.current && (tooltipRef.current.style.opacity = 0); }

    return (
        <div className="chart-kpi section-container">
            <div className="tooltip" ref={ tooltipRef }></div>
            <div className="main">
                <div className="item">
                    <div className="item-head">
                        { data[0].icon && <img className='icon' src={ data[0].icon.url } alt={ data[0].icon.alt  } /> }
                        <p className={ `p6 label ${ (data[0].name.length > maxLength) ? 'can-hover' : '' }` } data-text={ data[0].name } onMouseOver={ mouseover } onMouseLeave={ mouseleave }>{ trimmedText(data[0].name) }</p>
                    </div>
                    <p className="h2 title">{ data[0].value }</p>
                    { data[0].lastYearValue && <p className={ `p6 additional ${ ((data[0].value - data[0].lastYearValue) % data[0].lastYearValue * 100) < 0 ? 'down' : 'up' }` }>{ additionnalField(0) }</p> }
                </div>
            </div>
            <div className="second">
                {
                    data.map((d, i) => {
                        return i !== 0 && <div key={ i } className="item">
                            <div className="item-head">
                                { d.icon && <img className='icon' src={ d.icon.url } alt={ d.icon.alt  } /> }
                                <p className={ `p6 label ${ (d.name.length > maxLength) ? 'can-hover' : '' }` } data-text={ d.name } onMouseOver={ mouseover } onMouseLeave={ mouseleave }>{ trimmedText(d.name) }</p>
                            </div>
                            <p className="h4 title">{ d.value }</p>
                            { d.lastYearValue && <p className={ `p6 additional ${ ((d.value - d.lastYearValue) % d.lastYearValue * 100) < 0 ? 'down' : 'up' }` }>{ additionnalField(i) }</p> }
                        </div>;
                    })
                }
            </div>
        </div>
    );
}

export default ChartKPI;
