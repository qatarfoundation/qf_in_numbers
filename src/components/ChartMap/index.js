// React
import React, { useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

// JSON
import World from '@/assets/jsons/world-geojson.json';

function ChartMap(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();
    const { chart } = props;
    const data = chart.fields;
    // const data = [
    //     { long: 45, lat: 22.53, name: 'A', value: 34 }, // corsica
    //     { long: 7.26, lat: 43.71, name: 'A', value: 14 }, // nice
    //     { long: 2.349, lat: 48.864, name: 'B', value: 87 }, // Paris
    //     { long: -1.397, lat: 43.664, name: 'B', value: 41 }, // Hossegor
    //     { long: 3.075, lat: 50.640, name: 'C', value: 78 }, // Lille
    //     { long: -3.83, lat: 58, name: 'C', value: 12 }, // Morlaix
    // ];
    const isWorld = chart.isWorld ? chart.isWorld : true;
    const heightTooltip = 80;
    const spaceTooltip = 5;
    /**
     * States
     */
    const [margin, setMargin] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });
    const [isResize, setIsResize] = useState(false);
    const [height, setHeight] = useState(434 + margin.top + margin.bottom);
    /**
    * References
    */
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const svg = dataviz.select('svg');
            const width = refChart.current.querySelector('svg').clientWidth;
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            const map = World.features;
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', 'scale(1, 1)');
                // .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
            // Chart map
            const projection = d3.geoNaturalEarth1()
                .scale(isWorld ? 165 : 750)
                .translate([innerWidth / 2, (innerHeight / 2) + 35]);
            !isWorld && projection.center([45, 22.5]);
            chartContainer.append('g')
                .selectAll('path')
                .data(map)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', d3
                    .geoPath()
                    .projection(projection),
                );

            // Tooltip
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseover = d => tooltip.style('opacity', 1);
            const mousemove = (e, d) => {
                tooltip
                    .html(`<p class="p3">${ d.value }</p><p class="p4">${ d.name }</p>`)
                    .style('left', `${ e.target.cx.baseVal.value + margin.left - (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ e.target.cy.baseVal.value + margin.top - e.target.r.baseVal.value }px`);
            };
            const mouseleave = d => tooltip.style('opacity', 0);
            // Add a scale for bubble size
            const size = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([0, 30]);
            chartContainer
                .selectAll('myCircles')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'circle')
                .attr('cx', function(d) { return projection([d.long, d.lat])[0]; })
                .attr('cy', function(d) { return projection([d.long, d.lat])[1]; })
                .attr('r', function(d) { return size(d.value); })
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave);
        },
        [data.length, margin],
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
        setMargin({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        });
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    height={ height }
                    className="chart chart-map"
                />
            </div>
        </>
    );
}

export default ChartMap;
