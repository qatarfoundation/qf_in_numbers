// React
import React, { useEffect, useRef, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

function ChartLine(props, ref) {
    /**
     * Datas
     */
    const { chart } = props;
    console.log(chart);
    let data = chart;
    data = {
        title: 'Line Chart',
        lines: [],
        labelX: 'Label X',
        labelY: 'Label Y',
        type: 'lineChart',
    };
    for (let i = 1; i < 4; i++) {
        const line = {
            name: 'Title',
            points: [],
        };
        for (let j = 0; j < 6; j++) {
            const point = {
                name: 'Title',
                x: i * j,
                y: i * j / i,
            };
            line.points.push(point);
        }
        line.points.sort((a, b) => a - b);
        data.lines.push(line);
    }
    data = data.lines;
    console.log(data);
    const heightAxisX = 13;
    const spaceAxisX = 20;
    const widthAxisY = 17;
    const spaceAxisY = 50;
    const margin = { top: 10, right: 100, bottom: 30 + heightAxisX + spaceAxisX, left: 100 + widthAxisY + spaceAxisY };
    /**
     * States
     */
    const [width, setWidth] = useState(500 + margin.left + margin.right);
    const [height, setHeight] = useState(500 + margin.top + margin.bottom);
    /**
    * References
    */
    const refSwitch = useRef();
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const svg = dataviz.select('svg');
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
            // A color scale: one color for each group
            const myColor = d3.scaleOrdinal()
                .domain(data.map(d => d.name))
                .range(d3.schemeSet2);

            // Add X axis --> it is a date format
            const x = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d3.max(d.points, function(d) { return d.x; });})])
                .range([ 0, innerWidth ]);
            chartContainer.append('g')
                .attr('transform', 'translate(0,' + (innerHeight + spaceAxisX) + ')')
                .call(d3.axisBottom(x).tickSize(0));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d3.max(d.points, function(d) { return d.y; });})])
                .range([ innerHeight, 0 ]);
            chartContainer.append('g')
                .attr('transform', 'translate(' + -spaceAxisY + ', 0)')
                .call(d3.axisLeft(y).tickSize(0));

            // Add the lines
            const line = d3.line()
                .x(function(d) { return x(+d.x); })
                .y(function(d) { return y(+d.y); });
            chartContainer.selectAll('myLines')
                .data(data)
                .enter()
                .append('path')
                .attr('d', function(d) { return line(d.points); })
                .attr('stroke', function(d) { return myColor(d.name); })
                .style('stroke-width', 4)
                .style('fill', 'none');

            // Add the points
            chartContainer
            // First we need to enter in a group
                .selectAll('myDots')
                .data(data)
                .enter()
                .append('g')
                .style('fill', function(d) { return myColor(d.name); })
            // Second we need to enter in the 'values' part of this group
                .selectAll('myPoints')
                .data(function(d) { return d.points; })
                .enter()
                .append('circle')
                .attr('cx', function(d) { return x(d.x); })
                .attr('cy', function(d) { return y(d.y); })
                .attr('r', 5)
                .attr('stroke', 'white');

            // Add a legend at the end of each line
            chartContainer
                .selectAll('myLabels')
                .data(data)
                .enter()
                .append('g')
                .append('text')
                .datum(function(d) { return { name: d.name, value: d.points[d.points.length - 1] }; }) // keep only the last value of each time series
                .attr('transform', function(d) { return 'translate(' + x(d.value.x) + ',' + y(d.value.y) + ')'; }) // Put the text at the position of the last point
                .attr('x', 12) // shift the text a bit more right
                .text(function(d) { return d.name; })
                .style('fill', function(d) { return myColor(d.name); })
                .style('font-size', 15);
        },
        [data.length],
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
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    width={ width }
                    height={ height }
                    className="chart chart-heatmap"
                />
            </div>
        </>
    );
}

export default ChartLine;
