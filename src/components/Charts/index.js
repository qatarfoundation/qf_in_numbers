// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ChartBar from '@/components/ChartBar';
import Scrollbar from '@/components/ScrollBar';

function Charts(props, ref) {
    /**
     * Datas
     */
    const { charts } = props;
    return (
        <>
            {
                charts.map((chart, i) => {
                    console.log(chart);
                    let result = null;
                    switch (chart.type) {
                        case 'kpiChart':
                            result = <></>;
                            break;
                        case 'heatmapChart':
                            result = <></>;
                            break;
                        case 'barChart':
                            result = <ChartBar chart={ chart } />;
                            break;
                        case 'donutChart':
                            result = <></>;
                            break;
                        case 'lineChart':
                            result = <></>;
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
                        <section key={ i } className="section charts">
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
