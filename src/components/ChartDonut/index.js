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
    let data = chart.fields;
    data = [];
    data.push({ name: 'Title', value: 1, percent: 10 });
    data.push({ name: 'Title', value: 2, percent: 20 });
    data.push({ name: 'Title', value: 2, percent: 20 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 4, percent: 40 });
    data.push({ name: 'Title', value: 5, percent: 50 });
    data.push({ name: 'Title', value: 6, percent: 60 });
    data.push({ name: 'Title', value: 7, percent: 70 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 8, percent: 80 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 9, percent: 90 });
    data.push({ name: 'Title', value: 10, percent: 100 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    data.push({ name: 'Title', value: 3, percent: 30 });
    const value = d => d.value;
    const percent = d => d.percent;
    const xValue = d => d.name;
    const sizeCircle = 232;
    const widthStroke = 20;
    let margin = { top: 100, right: 100, bottom: 100, left: 100 };
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
                .innerRadius((sizeCircle / 2) * 1.25)
                .outerRadius((sizeCircle / 2) * 1.25);
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
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    console.log(midangle);
                    const x = outerArc.centroid(d)[0] + (w / 2);
                    const y = outerArc.centroid(d)[1] + (h / 2);
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
                    // pos[1] += (45 / 2) * dir;
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
        margin = { top: 100, right: window.innerWidth >= 500 ? 67 : 23, bottom: 0, left: window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 };
        setWidth((sizeCircle + paddingCircle) * lengthX + margin.right + margin.left);
        setHeight((sizeCircle + paddingCircle) * lengthY + margin.top + margin.bottom);
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
