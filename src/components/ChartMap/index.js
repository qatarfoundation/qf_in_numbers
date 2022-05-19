// React
import React, { useEffect, useRef, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

function ChartMap(props, ref) {
    /**
     * Datas
     */
    const { chart } = props;
    const data = chart.fields;
    const heightTooltip = 80;
    const spaceTooltip = 10;
    const margin = {
        top: 0 + heightTooltip + spaceTooltip,
        right: (window.innerWidth >= 500 ? 58 : 18),
        bottom: 30,
        left: (window.innerWidth >= 500 ? 58 : 18),
    };
    /**
     * States
     */
    const [isResize, setIsResize] = useState(false);
    const [height, setHeight] = useState(420);
    /**
    * References
    */
    const refSwitch = useRef();
    const refChart = useD3(
        (dataviz) => {
            // dataviz.select('.chart-container').remove();
            // const svg = dataviz.select('svg');
            // const width = refChart.current.querySelector('svg').clientWidth;
            // const innerWidth = width;
            // const innerHeight = height;
            // // Chart Container : contain all svg
            // const chartContainer = svg
            //     .append('g')
            //     .attr('class', 'chart-container')
            //     .attr('transform', 'scale(1, 1)');
            //     // .attr('transform', `translate(${ margin.left }, ${ margin.top })`);

            // const projection = d3.geoNaturalEarth1()
            //     .scale(innerWidth / 1.3 / Math.PI)
            //     .translate([innerWidth / 2, innerHeight / 2]);

            // // Load external data and boot
            // d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((d) => {
            //     chartContainer.append('g')
            //         .selectAll('path')
            //         .data(d.features)
            //         .enter().append('path')
            //         .attr('fill', '#69b3a2')
            //         .attr('d', d3.geoPath()
            //             .projection(projection),
            //         )
            //         .style('stroke', '#fff');
            // });
        },
        [data.length, isResize],
    );
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
    function resize() {
        setIsResize(!isResize);
    }
    return (
        <>
            { /* <div ref={ refChart } className="dataviz">
                <svg
                    height={ height }
                    className="chart chart-map"
                />
            </div> */ }
        </>
    );
}

export default ChartMap;
