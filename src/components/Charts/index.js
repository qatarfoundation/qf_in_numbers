// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Helpers
import getChartAnchor from '@/utils/helpers/getChartAnchor';

// Components
import Scrollbar from '@/components/ScrollBar';
import ChartBar from '@/components/ChartBar';
import ChartHeatmap from '@/components/ChartHeatmap';
import ChartLine from '@/components/ChartLine';
import ChartDonut from '@/components/ChartDonut';
import ChartBubble from '@/components/ChartBubble';
import ChartBeeswarm from '@/components/ChartBeeswarm';
import ChartMap from '@/components/ChartMap';
import ChartKPI from '@/components/ChartKPI';
import ChartText from '@/components/ChartText';
import FadeInWrapper from '@/components/FadeInWrapper';

function Charts(props) {
    /**
     * Datas
     */
    let { charts } = props;
    const { combine = true } = props;

    if (combine) {
        charts = Object.values(
            charts.reduce(
                (a, v) => ((a[v.type] || (a[v.type] = [])).push(v), a), {},
            ),
        ).map(c => {
            const result = {};
            result[c[0].type] = c;
            return result;
        });
    }

    function renderChart(chart) {
        const r = {};
        if (chart.title) {
            r.title = (<><h2 className="p2 section-container" id={ getChartAnchor(chart) }>{ chart.title.map(t => {
                let el = undefined;
                if (t.bold) {
                    el = <span key={ t.value } className='bold'>{ t.value }</span>;
                } else {
                    el = t.value;
                }
                return el;
            }) }</h2></>);
        }
        if (chart.subtitle) {
            r.subtitle = (<><p className="p6 subtitle section-container">{ chart.subtitle }</p></>);
        }
        if (chart.fields) {
            r.type = chart.type.toLowerCase();
            switch (chart.type) {
                case 'kpiChart':
                    r.chart = (<><ChartKPI chart={ chart } /></>);
                    break;
                case 'heatmapChart':
                    r.chart = (<><ChartHeatmap chart={ chart } /></>);
                    break;
                case 'barChart':
                    r.chart = (<><ChartBar chart={ chart } /></>);
                    break;
                case 'donutChart':
                    r.chart = (<><ChartDonut chart={ chart } /></>);
                    break;
                case 'lineChart':
                    r.chart = (<><ChartLine chart={ chart } /></>);
                    break;
                case 'bubbleChart':
                    r.chart = (<><ChartBubble chart={ chart } /></>);
                    break;
                case 'mapChart':
                    r.chart = (<><ChartMap chart={ chart } /></>);
                    break;
                case 'beeswarmChart':
                    r.chart = (<><ChartBeeswarm chart={ chart } /></>);
                    break;
                case 'textChart':
                    r.chart = (<><ChartText chart={ chart } /></>);
                    break;
            }
        }
        return r;
    }

    return (
        <>
            {
                charts.map((chart, i) => {
                    const result = [];
                    let chartName = null;

                    if (combine) {
                        chart[Object.keys(chart)[0]].map((c) => {
                            chartName = Object.keys(chart)[0];
                            result.push(renderChart(c));
                        });
                    } else {
                        chartName = chart.type;
                        result.push(renderChart(chart));
                    }

                    return (
                        <FadeInWrapper key={ i } as="section" className="section charts" data-name={ chartName }>
                            { result.length > 1 ?
                                <Scrollbar colored={ false } horizontalScroll="true" calcHeight={ false } name={ chartName }>
                                    <div className='charts-container'>
                                        { result.map((r, i) =>
                                            <div className={ `charts-item ${ r.type }` } key={ i }>
                                                { r.title && r.title }
                                                { r.subtitle && r.subtitle }
                                                { r.chart && r.chart }
                                            </div>,
                                        ) }
                                    </div>
                                </Scrollbar>
                                :
                                <>{ result.map((r, i) =>
                                    <div className={ `charts-item ${ r.type }` } key={ i }>
                                        { r.title && r.title }
                                        { r.subtitle && r.subtitle }
                                        <Scrollbar colored={ false } calcHeight={ false } name={ chartName }>
                                            <div className='charts-container'>
                                                { r.chart && r.chart }
                                            </div>
                                        </Scrollbar>
                                    </div>,
                                ) }</>
                            }
                        </FadeInWrapper>
                    );
                })
            }
            { /* {
                charts.map((chart, i) => {
                    // console.log(chart);
                    const result = [];
                    // const chartName = Object.keys(chart)[0];
                    const chartName = '';

                    const r = {};
                    const c = chart;

                    console.log(c);

                    if (c.title) {
                        r.title = (<><h2 className="p2 section-container" id={ getChartAnchor(c) }>{ c.title.map(t => {
                            let el = undefined;
                            if (t.bold) {
                                el = <span key={ t.value } className='bold'>{ t.value }</span>;
                            } else {
                                el = t.value;
                            }
                            return el;
                        }) }</h2></>);
                    }
                    if (c.subtitle) {
                        r.subtitle = (<><p className="p6 subtitle section-container">{ c.subtitle }</p></>);
                    }
                    if (c.fields) {
                        r.type = c.type.toLowerCase();
                        switch (c.type) {
                            case 'kpiChart':
                                r.chart = (<><ChartKPI chart={ c } /></>);
                                break;
                            case 'heatmapChart':
                                r.chart = (<><ChartHeatmap chart={ c } /></>);
                                break;
                            case 'barChart':
                                r.chart = (<><ChartBar chart={ c } /></>);
                                break;
                            case 'donutChart':
                                r.chart = (<><ChartDonut chart={ c } /></>);
                                break;
                            case 'lineChart':
                                r.chart = (<><ChartLine chart={ c } /></>);
                                break;
                            case 'bubbleChart':
                                r.chart = (<><ChartBubble chart={ c } /></>);
                                break;
                            case 'mapChart':
                                r.chart = (<><ChartMap chart={ c } /></>);
                                break;
                            case 'beeswarmChart':
                                r.chart = (<><ChartBeeswarm chart={ c } /></>);
                                break;
                            case 'textChart':
                                r.chart = (<><ChartText chart={ c } /></>);
                                break;
                        }
                    }

                    result.push(r);

                    return (
                        <FadeInWrapper key={ i } as="section" className="section charts" data-name={ chartName }>
                            { result.length > 1 ?
                                <Scrollbar colored={ false } horizontalScroll="true" calcHeight={ false } name={ chartName }>
                                    <div className='charts-container'>
                                        { result.map((r, i) =>
                                            <div className={ `charts-item ${ r.type }` } key={ i }>
                                                { r.title && r.title }
                                                { r.subtitle && r.subtitle }
                                                { r.chart && r.chart }
                                            </div>,
                                        ) }
                                    </div>
                                </Scrollbar>
                                :
                                <>{ result.map((r, i) =>
                                    <div className={ `charts-item ${ r.type }` } key={ i }>
                                        { r.title && r.title }
                                        { r.subtitle && r.subtitle }
                                        <Scrollbar colored={ false } calcHeight={ false } name={ chartName }>
                                            <div className='charts-container'>
                                                { r.chart && r.chart }
                                            </div>
                                        </Scrollbar>
                                    </div>,
                                ) }</>
                            }
                        </FadeInWrapper>
                    );
                })
            } */ }
        </>
    );
}

export default Charts;
