// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import Scrollbar from '@/components/ScrollBar';
import ChartBar from '@/components/ChartBar';
import ChartHeatmap from '@/components/ChartHeatmap';
import ChartLine from '@/components/ChartLine';

function Charts(props, ref) {
    /**
     * Datas
     */
    const { charts } = props;
    return (
        <>
            {
                charts.map((chart, i) => {
                    let result = null;
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
                            result = <></>;
                            break;
                        case 'lineChart':
                            result = <ChartLine chart={ chart } />;
                            break;
                        case 'bubbleChart':
                            result = <></>;
                            break;
                        case 'mapChart':
                            result = <></>;
                            break;
                        case 'beeswarmChart':
                            result = <></>;
                            break;
                    }
                    return <>
                        <section key={ i } className="section charts" data-name={ chart.type }>
                            <h2 className="p2 section-container">{ chart.title }</h2>
                            <Scrollbar colored={ false }>
                                { result }
                            </Scrollbar>
                        </section>
                    </>;
                })
            }
        </>
    );
}

export default Charts;
