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

function ChartBubble(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();
    const { chart } = props;
    const data = chart.fields;
    const heightTooltip = 80;
    const spaceTooltip = 12.5;
    const s = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([8, 85]);
    let test = 0;
    data.forEach(d => {
        test += s(d.value);
    });
    /**
     * States
     */
    const [isResize, setIsResize] = useState(false);
    const [margin, setMargin] = useState({
        top: 20,
        right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
        bottom: 10,
        left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
    });
    /**
    * References
    */
    const refSwitch = useRef();
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const svg = dataviz.select('svg');
            const width = refChart.current.querySelector('svg').clientWidth;
            const height = refChart.current.querySelector('svg').clientHeight;
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            // Tooltip
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseover = (e, d) => e.target.classList.contains('can-hover') && tooltip.style('opacity', 1);
            const mousemove = (e, d) => {
                e.target.classList.contains('can-hover') && tooltip
                    .html(`<p class="p3">${ d.value }</p><p class="p4">${ d.name }</p>`)
                    .style('left', `${ e.target.cx.baseVal.value + margin.left - (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ e.target.cy.baseVal.value - e.target.r.baseVal.value + margin.top - spaceTooltip }px`);
            };
            const mouseleave = (e, d) => e.target.classList.contains('can-hover') && tooltip.style('opacity', 0);
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ language !== 'ar-QA' ? margin.left : margin.right }, ${ margin.top })`);
            // ---
            const color = d3.scaleLinear()
                .range(['#E9F8F3', '#6ECEB2'])
                .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);
            const size = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([8, 85]);
            const node = chartContainer.append('g')
                .selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', function(d) {
                    const isHide = size(d.value) <= 30 ? true : false;
                    return `node ${ isHide ? 'can-hover' : '' }`;
                })
                .attr('r', function(d) { return size(d.value);})
                .attr('cx', innerWidth / 2)
                .attr('cy', innerHeight / 2)
                .style('fill', function(d) { return color(d.value);})
                .style('fill-opacity', 0.8)
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave);
            const texts = chartContainer.selectAll('text')
                .data(data)
                .enter()
                .append('svg:text')
                .attr('class', function(d) {
                    const isHide = size(d.value) <= 30 ? true : false;
                    return `p4 label ${ isHide ? 'is-hidden' : '' }`;
                })
                .attr('x', innerWidth / 2)
                .attr('y', innerHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .text(function(d) {
                    return d.name;
                });
            const simulation = d3.forceSimulation()
                .force('center', d3.forceCenter().x(0).y(0))
                .force('charge', d3.forceManyBody().strength(0.1))
                .force('y', d3.forceY().y(d => 0))
                .force('collide', d3.forceCollide().strength(.2).radius(function(d) { return (size(d.value) + 3); }).iterations(1));
            const el = refChart.current.querySelector('.chart-container');
            simulation
                .nodes(data)
                .on('end', d => {
                    node
                        .attr('cx', function(d) { return d.x; })
                        .attr('cy', function(d) { return d.y; });
                    texts
                        .attr('x', function(d) { return d.x; })
                        .attr('y', function(d) { return d.y; });
                    setTimeout(() =>{
                        if (refChart.current) {
                            const bounding = el.getBoundingClientRect();
                            const isNew = refChart.current.clientWidth < bounding.width;
                            const newWidth = isNew ? bounding.width + margin.left + margin.right : refChart.current.clientWidth;
                            el.parentNode.setAttribute('width', newWidth);
                            el.parentNode.setAttribute('height', bounding.height + margin.top + margin.bottom);
                            el.parentNode.style.height = bounding.height + margin.top + margin.bottom;
                            node
                                .attr('cx', function(d) { return isNew ? d.x + (newWidth / 2) - (language !== 'ar-QA' ? margin.left : margin.right) : d.x + (newWidth / 2)  - (language !== 'ar-QA' ? margin.left : margin.right); })
                                .attr('cy', function(d) { return d.y + (bounding.height / 2); });
                            texts
                                .attr('x', function(d) { return isNew ? d.x + (newWidth / 2) - (language !== 'ar-QA' ? margin.left : margin.right) : d.x + (newWidth / 2)  - (language !== 'ar-QA' ? margin.left : margin.right); })
                                .attr('y', function(d) { return d.y + (bounding.height / 2); });
                        }
                    }, 0);
                });
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
        setMargin({
            top: 20,
            right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
            bottom: 10,
            left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
        });
        setIsResize(!isResize);
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    className="chart chart-bubble"
                />
            </div>
        </>
    );
}

export default ChartBubble;
