// React
import React, { useEffect, useRef } from 'react';

// Vendor
import textFit from 'textfit';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import Breakpoints from '@/utils/Breakpoints';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

// CSS
import './style.scoped.scss';
import useStore from '@/hooks/useStore';
import Odometer from '../Odometer';

function ChartKPI(props, ref) {
    /**
     * Datas
     */
    const maxLength = 35;
    const { chart } = props;
    const data = chart.fields;
    chart.lastYearFields = chart.fields;

    // !!! Ask to Leo to get the last year value from each KPI chart
    // data[0].lastYearValue = 120;

    const rows = [];
    for (let i = 1; i < data.length; i += 2) {
        rows.push([
            data[i + 0],
            data[i + 1],
        ]);
    }

    /**
     * Store
     */
    const currentYear = useStore((state) => state.currentYear);
    /**
     * References
     */
    const tooltipRef = useRef();
    const highlightLabelRef = useRef();
    const containerRef = useRef();
    const listNameRef = useRef([]);
    const highlightValueRef = useRef();

    useEffect(() => {
        resize();
    }, []);

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
    // function truncate(str, n) {
    //     return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
    // }
    // function mouseover(e) {
    //     if (!e.target.classList.contains('can-hover')) return;
    //     tooltipRef.current.innerHTML = `<p class="p6">${ e.target.dataset.text }</p>`;
    //     const offsetLeft = e.target.offsetLeft + parseInt(window.getComputedStyle(containerRef.current, null).getPropertyValue('padding-left'));
    //     const left = offsetLeft + e.target.offsetWidth / 2;
    //     tooltipRef.current.style.left = `${ left }px`;
    //     tooltipRef.current.style.top = `${ e.target.offsetTop - 15 }px`;
    //     tooltipRef.current.style.opacity = 1;
    // }
    // function mouseleave(e) { e.target.classList.contains('can-hover') && tooltipRef.current && (tooltipRef.current.style.opacity = 0); }

    function resize() {
        resizeHighlightLabel();
        if (!Breakpoints.active('small')) {
            const viewportWidth = WindowResizeObserver.fullWidth;
            const fontSize = 96;
            const maxFontSize = viewportWidth < 1440 ? Breakpoints.rem(fontSize) : fontSize;
            textFit(highlightValueRef.current, {
                widthOnly: true,
                maxFontSize,
            });
        }
    }

    function resizeHighlightLabel() {
        if (!highlightLabelRef.current) return;
        const leftElementHeight = listNameRef.current[0] ? listNameRef.current[0].offsetHeight : 0;
        const rightElementHeight = listNameRef.current[1] ? listNameRef.current[1].offsetHeight : 0;
        const highlightLabelHeight = highlightLabelRef.current.offsetHeight;
        const height = Math.max(leftElementHeight, rightElementHeight, highlightLabelHeight);
        highlightLabelRef.current.style.height = `${ height }px`;
    }

    useWindowResizeObserver(resize);

    return (
        <div className="chart-kpi section-container" ref={ containerRef }>
            <div className="tooltip" ref={ tooltipRef }>asdsad</div>
            <div className="content">
                <div className="highlight">
                    <div className={ `label ${ data[0].icon ? 'with-icon' : '' }` } ref={ highlightLabelRef }>
                        <div>{ data[0].icon && <img className="label__icon" src={ data[0].icon.url } alt={ data[0].icon.alt } /> }</div>
                        <span className={ `p6 label__text ${ (data[0].name.length > maxLength) ? 'can-hover' : '' }` } data-text={ data[0].name }>{ data[0].name }</span>
                    </div>
                    <Odometer className="h2 value" ref={ highlightValueRef }>{ data[0].value }</Odometer>
                    { data[0].lastYearValue && <span className={ `p6 change ${ ((data[0].value - data[0].lastYearValue) % data[0].lastYearValue * 100) < 0 ? 'down' : 'up' }` }>{ additionnalField(0) }</span> }
                </div>

                <ul className="list values">
                    {
                        rows.map((row, index) => {
                            return (
                                <li key={ index }>
                                    <ul className="row">
                                        <li>
                                            {
                                                row[0] && (
                                                    <div className={ `label ${ row[0].icon ? 'with-icon' : '' }` } ref={ el => listNameRef.current[index + 0] = el }>
                                                        <div>{ row[0].icon && <img className="label__icon" src={ row[0].icon.url } alt={ row[0].icon.alt } /> }</div>
                                                        <span className={ `p6 label__text ${ (row[0].name.length > maxLength) ? 'can-hover' : '' }` } data-text={ row[0].name }>{ row[0].name }</span>
                                                    </div>
                                                )
                                            }
                                        </li>
                                        <li>
                                            {
                                                row[1] && (
                                                    <div className={ `label ${ row[1].icon ? 'with-icon' : '' }` } ref={ el => listNameRef.current[index + 1] = el }>
                                                        <div>{ row[1].icon && <img className="label__icon" src={ row[1].icon.url } alt={ row[1].icon.alt } /> }</div>
                                                        <span className={ `p6 label__text ${ (row[1].name.length > maxLength) ? 'can-hover' : '' }` } data-text={ row[1].name }>{ row[1].name }</span>
                                                    </div>
                                                )
                                            }
                                        </li>
                                        <li>
                                            <span className="h4 value" data-number={ row[0] && row[0].value }><Odometer>{ row[0] && row[0].value }</Odometer></span>
                                            { row[0] && row[0].lastYearValue && <span className={ `p6 change ${ ((row[0].value - row[0].lastYearValue) % row[0].lastYearValue * 100) < 0 ? 'down' : 'up' }` }>{ additionnalField(0) }</span> }
                                        </li>
                                        <li>
                                            { row[1] && row[1].value && (<span className="h4 value" data-number={ row[1] && row[1].value }><Odometer>{ row[1] && row[1].value }</Odometer></span>) }
                                            { row[1] && row[1].lastYearValue && <span className={ `p6 change ${ ((row[1].value - row[1].lastYearValue) % row[1].lastYearValue * 100) < 0 ? 'down' : 'up' }` }>{ additionnalField(0) }</span> }
                                        </li>
                                    </ul>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default ChartKPI;
