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

function Charts(props, ref) {
    /**
     * Datas
     */
    const { charts } = props;
    return (
        <>
            {
                charts.map((chart, i) => {
                    let result = <></>;
                    if (chart.fields) {
                        console.log('type', chart.type);
                        switch (chart.type) {
                            case 'kpiChart':
                                result = <></>;
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
                        <h2 className="p2 section-container">{ chart.title }</h2>
                        { chart.subtitle && <p className="p6 subtitle section-container">{ chart.subtitle }</p> }
                        <Scrollbar colored={ false }>
                            <div className='charts-container'>{ result }</div>
                        </Scrollbar>
                    </section>;
                })
            }
        </>
    );
}

export default Charts;
