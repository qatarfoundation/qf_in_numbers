// React
import React, { useEffect, useRef, useState } from 'react';

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
    const { chart } = props;
    console.log(chart);
    const data = chart.fields;
    const heightTooltip = 80;
    const spaceTooltip = 12.5;
    const margin = {
        top: 0,
        right: (window.innerWidth >= 500 ? 58 : 18),
        bottom: 0,
        left: (window.innerWidth >= 500 ? 58 : 18),
    };
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
                    .style('left', `${ e.target.cx.baseVal.value + margin.left }px`)
                    .style('top', `${ e.target.cy.baseVal.value - e.target.r.baseVal.value + margin.top - spaceTooltip }px`);
            };
            const mouseleave = (e, d) => e.target.classList.contains('can-hover') && tooltip.style('opacity', 0);
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
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
                .force('center', d3.forceCenter().x(0).y(innerHeight / 2))
                .force('charge', d3.forceManyBody().strength(0.1))
                .force('y', d3.forceY().y(d => 0))
                .force('collide', d3.forceCollide().strength(.2).radius(function(d) { return (size(d.value) + 3); }).iterations(1)); // Force that avoids circle overlapping
            const el = refChart.current.querySelector('.chart-container');
            let isForcing = true;
            simulation
                .nodes(data)
                .on('tick', function(d) {
                    if (isForcing) {
                        let newWidth = el.getBoundingClientRect().width;
                        if (refChart.current.clientWidth < newWidth) {
                            newWidth += margin.left + margin.right;
                            const oldWidth = el.parentNode.getAttribute('width');
                            el.parentNode.setAttribute('width', newWidth);
                            node
                                .attr('cx', function(d) { return d.x + (newWidth / 2) - margin.left - margin.right; })
                                .attr('cy', function(d) { return d.y; });
                            texts
                                .attr('x', function(d) { return d.x + (newWidth / 2) - margin.left - margin.right; })
                                .attr('y', function(d) { return d.y; });
                            if (oldWidth) {
                                if (oldWidth == newWidth) {
                                    isForcing = false;
                                    simulation.stop();
                                }
                            }
                        } else {
                            el.parentNode.setAttribute('width', refChart.current.clientWidth);
                            node
                                .attr('cx', function(d) { return d.x + (refChart.current.clientWidth / 2) - (85 / 2); })
                                .attr('cy', function(d) { return d.y; });
                            texts
                                .attr('x', function(d) { return d.x + (refChart.current.clientWidth / 2) - (85 / 2); })
                                .attr('y', function(d) { return d.y; });
                        }
                    }
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
