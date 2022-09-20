// React
import React from 'react';

// CSS
import './style.scoped.scss';

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
import FadeInWrapper from '@/components/FadeInWrapper';

function Charts(props, ref) {
    /**
     * Datas
     */
    let { charts } = props;
    charts = Object.values(
        charts.reduce(
            (a, v) => ((a[v.type] || (a[v.type] = [])).push(v), a), {},
        ),
    ).map(c => {
        const result = {};
        result[c[0].type] = c;
        return result;
    });
    return (
        <>
            {
                charts.map((chart, i) => {
                    const result = [];
                    chart[Object.keys(chart)[0]].map((c, j) => {
                        const r = {};
                        if (c.title) {
                            r.title = (<><h2 className="p2 section-container">{ c.title.map(t => {
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
                            }
                        }
                        result.push(r);
                    });
                    return (
                        <FadeInWrapper key={ i } as="section" className="section charts" data-name={ chart.type }>
                            { result.length > 1 ?
                                <Scrollbar colored={ false } horizontalScroll="true">
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
                                        <Scrollbar colored={ false }>
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
                    let result = <></>;
                    if (chart.fields) {
                        switch (chart.type) {
                            case 'kpiChart':
                                result = <ChartKPI chart={ chart } />;
                                break;
                            case 'heatmapChart':
                                result = <ChartHeatmap chart={ chart } />;
                                break;
                            case 'barChart':
                                result = <ChartBar chart={ chart } />;
                                break;
                            case 'donutChart':
                                result = <ChartDonut chart={ chart } />;
                                break;
                            case 'lineChart':
                                result = <ChartLine chart={ chart } />;
                                break;
                            case 'bubbleChart':
                                result = <ChartBubble chart={ chart } />;
                                break;
                            case 'mapChart':
                                result = <ChartMap chart={ chart } />;
                                break;
                            case 'beeswarmChart':
                                result = <ChartBeeswarm chart={ chart } />;
                                break;
                        }
                    }
                    return <section key={ i } className="section charts" data-name={ chart.type }>
                        { chart.title && <h2 className="p2 section-container">{ chart.title.map(t => {
                            let el = undefined;
                            if (t.bold) {
                                el = <span key={ t.value } className='bold'>{ t.value }</span>;
                            } else {
                                el = t.value;
                            }
                            return el;
                        }) }</h2> }
                        { chart.subtitle && <p className="p6 subtitle section-container">{ chart.subtitle }</p> }
                        <Scrollbar colored={ false }>
                            <div className='charts-container'>{ result }</div>
                        </Scrollbar>
                    </section>;
                })
            } */ }
        </>
    );
}

export default Charts;
