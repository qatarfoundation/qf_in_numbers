// React
import React, { useEffect } from 'react';

// CSS
import './style.scoped.scss';

function SequenceCharts(props) {
    const { charts } = props;

    return (
        <ul className="sequence-chart">

            {
                charts.reverse().map(chart => {
                    return <li key={ chart } className="sequence-item">
                        <p className='p5'>{ chart }</p>
                    </li>;
                })
            }

        </ul>
    );
}

export default SequenceCharts;
