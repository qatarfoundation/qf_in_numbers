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

function ChartLine(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();
    const { chart } = props;
    const data = chart.fields;
    const radiusPoint = 5;
    const heightTooltip = 80;
    const spaceTooltip = 10;
    const heightAxisX = 25;
    const spaceAxisX = 20;
    const widthAxisY = 14;
    const spaceAxisY = 45;
    /**
     * States
     */
    const [isResize, setIsResize] = useState(false);
    const [margin, setMargin] = useState({
        top: 0 + heightTooltip + spaceTooltip,
        right: language !== 'ar-QA' ? 44 : (window.innerWidth >= 500 ? 58 : 18) + spaceAxisY + widthAxisY,
        bottom: 30 + heightAxisX + spaceAxisX,
        left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) + spaceAxisY + widthAxisY : 44,
    });
    const [height, setHeight] = useState(255 + margin.top + margin.bottom);
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
            // Tooltip
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseover = d => tooltip.style('opacity', 1);
            const mousemove = (e, d) => {
                tooltip
                    .html(`<p class="p3">${ d.y }</p><p class="p4">${ d.name }</p>`)
                    .style('left', `${ e.target.cx.baseVal.value + (language !== 'ar-QA' ? margin.left : margin.right) - (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ e.target.cy.baseVal.value + margin.top - radiusPoint - spaceTooltip }px`);
            };
            const mouseleave = d => tooltip.style('opacity', 0);
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ language !== 'ar-QA' ? margin.left : margin.left }, ${ margin.top })`);
            // Add X axis
            const x = d3.scaleLinear()
                .domain([d3.min(data, d => d3.min(d.fields, d => d.x)), d3.max(data, d => d3.max(d.fields, d => d.x))])
                .range(language !== 'ar-QA' ? [ 0, innerWidth ] : [ innerWidth, 0 ]);
            chartContainer.append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', `translate(0, ${ innerHeight + spaceAxisX })`)
                .call(d3.axisBottom(x).tickSize(0).tickFormat(d3.format('')));
            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d3.max(d.fields, d => d.y))])
                .range([ innerHeight, 0 ]);
            const axisY = chartContainer.append('g')
                .attr('class', 'axis axis-y')
                .attr('transform', `translate(${ language !== 'ar-QA' ? -(spaceAxisY + widthAxisY - (window.innerWidth >= 500 ? 7 : 4))  : spaceAxisY + (window.innerWidth >= 500 ? 7 : 4) + innerWidth }, 0)`)
                .call(language !== 'ar-QA' ? d3.axisLeft(y).tickSize(0) : d3.axisRight(y).tickSize(0));
            chartContainer.append('g')
                .attr('class', 'grid grid-y')
                .call(d3.axisLeft(y)
                    .ticks(5)
                    .tickSize(-innerWidth)
                    .tickFormat(''),
                );
            // Lines Container : contain all lines
            const linesContainer = chartContainer
                .append('g')
                .attr('class', 'lines-container');
            // Line Container : contain all lines
            const lineContainer = linesContainer
                .selectAll('line')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'line-container');
            // Add the line
            const line = d3.line()
                .x(d => x(+d.x))
                .y(d => y(+d.y));
            // Line
            lineContainer
                .append('path')
                .attr('class', 'line')
                .attr('d', d => line(d.fields));
            // Points Container : contain all points of a line
            const pointsContainer = lineContainer
                .append('g')
                .attr('class', 'points-container');
            // Add the points
            pointsContainer
                // Point
                .selectAll('myPoints')
                .data(d => d.fields)
                .enter()
                .append('circle')
                .attr('class', 'point')
                .attr('cx', d => x(d.x))
                .attr('cy', d => y(d.y))
                .attr('r', radiusPoint)
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
            top: 0 + heightTooltip + spaceTooltip,
            right: language !== 'ar-QA' ? 44 : (window.innerWidth >= 500 ? 58 : 18) + spaceAxisY + widthAxisY,
            bottom: 30 + heightAxisX + spaceAxisX,
            left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) + spaceAxisY + widthAxisY : 44,
        });
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    height={ height }
                    className="chart chart-line"
                />
            </div>
        </>
    );
}

export default ChartLine;
