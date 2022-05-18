// React
import React, { useEffect, useRef, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

function ChartDonut(props, ref) {
    /**
     * Datas
     */
    const { chart } = props;
    const data = chart.fields;
    let sizeCircle = window.innerWidth >= 500 ? 232 : 172;
    const widthStroke = 20;
    let margin = { top: 100, right: 75 + (window.innerWidth >= 500 ? 62 : 18), bottom: 75, left: 75 + (window.innerWidth >= 500 ? 62 : 18) };
    /**
     * States
     */
    const [width, setWidth] = useState(sizeCircle + margin.right + margin.left);
    const [height, setHeight] = useState(sizeCircle + margin.top + margin.bottom);
    /**
    * References
    */
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const w = width;
            const h = height;
            const innerWidth = w - margin.left - margin.right;
            const innerHeight = h - margin.top - margin.bottom;
            const svg = dataviz.select('svg');
            const chartContainer =  svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');
            const percent = d3.scaleLinear()
                .domain([0, data.length])
                .range([0, 100]);
            const color = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range(['#E9F8F3', '#6ECEB2']);
            const pie = d3.pie()
                .value(d => d.value).sort(null);
            const data_ready = pie(data);
            const donutContainer =  chartContainer
                .append('g')
                .attr('class', 'donut-container');
            const legendContainer =  donutContainer
                .append('g')
                .attr('class', 'legend-container');
            legendContainer
                .append('text')
                .text(chart.length)
                .attr('class', 'h4 label')
                .attr('dy', '0.15em');
            legendContainer
                .append('text')
                .text(chart.name)
                .attr('class', 'p7 label')
                .attr('y', 30)
                .attr('dy', '0.15em');
            const outerArc = d3.arc()
                .innerRadius(((sizeCircle / 2) + (48 / 2)) * (window.innerWidth >= 500 ? 1.05 : 0.95))
                .outerRadius(((sizeCircle / 2) + (48 / 2)) * (window.innerWidth >= 500 ? 1.05 : 0.95));
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseover = function(e, d) {
                if (e.target.classList.contains('can-hover')) {
                    tooltip.style('opacity', 1);
                }
            };
            const mousemove = function(e, d) {
                if (e.target.classList.contains('can-hover')) {
                    const arc = d3.arc()
                        .innerRadius((sizeCircle / 2) * (window.innerWidth >= 500 ? 1.4 : 1.5))
                        .outerRadius((sizeCircle / 2) * (window.innerWidth >= 500 ? 1.4 : 1.5));
                    const x = arc.centroid(d)[0] + (w / 2);
                    const y = arc.centroid(d)[1] + (h / 2);
                    tooltip
                        .html(`<p class="p3">${ d.data.value }</p><p class="p4">${ d.data.name }</p>`)
                        .style('left', `${ x }px`)
                        .style('top', `${ y }px`);
                }
            };
            const mouseleave = function(e) {
                if (e.target.classList.contains('can-hover')) {
                    tooltip.style('opacity', 0);
                }
            };
            donutContainer
                .selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('class', function(d) {
                    const canHover = percent(d.data.value) <= 20 ? true : false;
                    return `arc ${ canHover ? 'can-hover' : '' }`;
                })
                .attr('d', d3.arc()
                    .innerRadius(sizeCircle / 2 - widthStroke)
                    .outerRadius(sizeCircle / 2),
                )
                .attr('fill', function(d) { return(color(d.data.value)); })
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave);
            const labelContainer = donutContainer
                .selectAll('allLabels')
                .data(data_ready)
                .enter()
                .append('g')
                .attr('class', function(d) {
                    const isHide = percent(d.data.value) <= 20 ? true : false;
                    return `label-container ${ isHide ? 'is-hidden' : '' }`;
                })
                .attr('transform', function(d) {
                    const pos = outerArc.centroid(d);
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    const dir = midangle < Math.PI ? 1 : -1;
                    // pos[0] += (45 / 2) * dir;
                    // pos[1] += 48 / 2;
                    return 'translate(' + pos + ')';
                });
            labelContainer
                .append('text')
                .text(function(d) { return d.data.value; })
                .attr('class', 'p3 label')
                .attr('dy', '0.15em')
                .style('text-anchor', function(d) {
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    return (midangle < Math.PI ? 'start' : 'end');
                });
            labelContainer
                .append('text')
                .text(function(d) { return d.data.name; })
                .attr('class', 'p6 label')
                .attr('y', 17.5)
                .attr('dy', '0.15em')
                .style('text-anchor', function(d) {
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    return (midangle < Math.PI ? 'start' : 'end');
                });
        },
        [data.length, width],
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
        margin = { top: 100, right: 75 + (window.innerWidth >= 500 ? 62 : 18), bottom: 75, left: 75 + (window.innerWidth >= 500 ? 62 : 18) };
        sizeCircle = window.innerWidth >= 500 ? 232 : 172;
        setWidth(sizeCircle + margin.right + margin.left);
        setHeight(sizeCircle + margin.top + margin.bottom);
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    width={ width }
                    height={ height }
                    className="chart chart-donut"
                />
            </div>
        </>
    );
}

export default ChartDonut;
