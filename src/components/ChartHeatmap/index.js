// React
import React, { useEffect, useRef, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

// Icon
import Chart from '@/assets/icons/chart.svg';
import Percent from '@/assets/icons/percent.svg';

function ChartHeatmap(props, ref) {
    /**
     * Store
     */
    const [scrolls, iScroll] = useStore((state) => [state.scrolls, state.iScroll]);
    /**
     * Datas
     */
    const { chart } = props;
    const data = [
        { group: 'Qatari Female', variable: 'HBKU', value: '94', percent: '75' },
        { group: 'Qatari Female', variable: 'VCUarts', value: '37', percent: '30' },
        { group: 'Qatari Female', variable: 'UCL', value: '37', percent: '30' },
        { group: 'Qatari Female', variable: 'TAMU-Q', value: '63', percent: '50' },
        { group: 'Qatari Female', variable: 'NU-Q', value: '18', percent: '15' },
        { group: 'Qatari Female', variable: 'HECParis', value: '63', percent: '50' },
        { group: 'Qatari Female', variable: 'HECLyon', value: '63', percent: '50' },
        { group: 'Qatari Female', variable: 'GU-Q', value: '94', percent: '75' },
        { group: 'Qatari Female', variable: 'CMU-Q', value: '126', percent: '100' },
        { group: 'Qatari Male', variable: 'HBKU', value: '94', percent: '75' },
        { group: 'Qatari Male', variable: 'VCUarts', value: '126', percent: '100' },
        { group: 'Qatari Male', variable: 'UCL', value: '63', percent: '50' },
        { group: 'Qatari Male', variable: 'TAMU-Q', value: '94', percent: '75' },
        { group: 'Qatari Male', variable: 'NU-Q', value: '37', percent: '30' },
        { group: 'Qatari Male', variable: 'HECParis', value: '37', percent: '30' },
        { group: 'Qatari Male', variable: 'HECLyon', value: '63', percent: '50' },
        { group: 'Qatari Male', variable: 'GU-Q', value: '94', percent: '75' },
        { group: 'Qatari Male', variable: 'CMU-Q', value: '63', percent: '50' },
        { group: 'Non-Qatari Female', variable: 'HBKU', value: '63', percent: '100' },
        { group: 'Non-Qatari Female', variable: 'VCUarts', value: '94', percent: '75' },
        { group: 'Non-Qatari Female', variable: 'UCL', value: '94', percent: '75' },
        { group: 'Non-Qatari Female', variable: 'TAMU-Q', value: '126', percent: '100' },
        { group: 'Non-Qatari Female', variable: 'NU-Q', value: '63', percent: '50' },
        { group: 'Non-Qatari Female', variable: 'HECParis', value: '37', percent: '30' },
        { group: 'Non-Qatari Female', variable: 'HECLyon', value: '37', percent: '30' },
        { group: 'Non-Qatari Female', variable: 'GU-Q', value: '37', percent: '30' },
        { group: 'Non-Qatari Female', variable: 'CMU-Q', value: '63', percent: '50' },
        { group: 'Non-Qatari Male', variable: 'HBKU', value: '37', percent: '30' },
        { group: 'Non-Qatari Male', variable: 'VCUarts', value: '63', percent: '50' },
        { group: 'Non-Qatari Male', variable: 'UCL', value: '94', percent: '75' },
        { group: 'Non-Qatari Male', variable: 'TAMU-Q', value: '126', percent: '100' },
        { group: 'Non-Qatari Male', variable: 'NU-Q', value: '63', percent: '50' },
        { group: 'Non-Qatari Male', variable: 'HECParis', value: '18', percent: '15' },
        { group: 'Non-Qatari Male', variable: 'HECLyon', value: '18', percent: '15' },
        { group: 'Non-Qatari Male', variable: 'GU-Q', value: '37', percent: '30' },
        { group: 'Non-Qatari Male', variable: 'CMU-Q', value: '37', percent: '30' },
    ];
    const value = d => d.value;
    const percent = d => d.percent;
    const xValue = d => d.variable;
    const yValue = d => d.group;
    const sizeCircle = 43;
    const paddingCircle = 13;
    const lengthX = data.map(xValue).filter((item, pos) => data.map(xValue).indexOf(item) == pos).length;
    const lengthY = data.map(yValue).filter((item, pos) => data.map(yValue).indexOf(item) == pos).length;
    let margin = { top: 100, right: window.innerWidth >= 500 ? 67 : 23, bottom: 0, left: window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 };
    /**
     * States
     */
    const [width, setWidth] = useState((sizeCircle + paddingCircle) * lengthX + margin.right + margin.left);
    const [height, setHeight] = useState((sizeCircle + paddingCircle) * lengthY + margin.top + margin.bottom);
    const [chartActive, setChartActive] = useState(true);
    const [percentActive, setPercentActive] = useState(false);
    /**
    * References
    */
    const refSwitch = useRef();
    const refChart = useD3(
        (svg) => {
            svg.select('.chart-container').remove();
            const w = width;
            const h = height;
            const innerWidth = w - margin.left - margin.right;
            const innerHeight = h - margin.top - margin.bottom;
            const xScale = d3
                .scaleBand()
                .range([ 0, innerWidth ])
                .domain(data.map(xValue).filter((item, pos) => data.map(xValue).indexOf(item) == pos))
                .padding(0.2);
            const yScale = d3
                .scaleBand()
                .range([ 0, innerHeight ])
                .domain(data.map(yValue).filter((item, pos) => data.map(yValue).indexOf(item) == pos))
                .padding(0.2);
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
            const myColor = d3.scaleLinear()
                .range(['white', '#6ECEB2'])
                .domain([1, 100]);
            const tooltip = d3.select('.dataviz')
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseover = function(d) {
                tooltip.style('opacity', 1);
            };
            const mousemove = function(e, d) {
                tooltip
                    .html(`<p class="p3">${ d.value }</p><p class="p4">${ d.group }</p>`)
                    .style('left', `${ e.target.cx.baseVal.value + margin.left }px`)
                    .style('top', `${ e.target.cy.baseVal.value + margin.top - sizeCircle - 22 }px`);
            };
            const mouseleave = function(d) {
                tooltip.style('opacity', 0);
            };
            const switchContainer = d3
                .select('.switch-container')
                .attr('defaultScroll', `${  (window.innerWidth >= 500 ? 67 : 23) }`)
                .style('left', `${ (window.innerWidth >= 500 ? 67 : 23) }px`)
                .style('top', `${ 32 }px`);
            const circlesContainer = chartContainer
                .append('g')
                .attr('class', 'circles-container');
            if (chartActive) {
                circlesContainer.selectAll()
                    .data(data, function(d) {return d.group + ':' + d.variable;})
                    .enter()
                    .append('circle')
                    .attr('class', 'circle circle-graph')
                    .attr('cx', d => xScale(xValue(d)) + yScale.bandwidth() / 2)
                    .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
                    .attr('r', d => (yScale.bandwidth() / 2) * (percent(d) / 100))
                    .style('fill', function(d) { return myColor(d.value);})
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseleave', mouseleave);
            }
            if (percentActive) {
                circlesContainer.selectAll()
                    .data(data, function(d) {return d.group + ':' + d.variable;})
                    .enter()
                    .append('circle')
                    .attr('class', 'circle circle-percent')
                    .attr('cx', d => xScale(xValue(d)) + yScale.bandwidth() / 2)
                    .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
                    .attr('r', d => yScale.bandwidth() / 2)
                    .style('stroke', function(d) { return myColor(d.value);})
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseleave', mouseleave);
                circlesContainer.selectAll()
                    .data(data, function(d) {return d.group + ':' + d.variable;})
                    .enter()
                    .append('text')
                    .text(d => percent(d))
                    .attr('class', 'p6 label')
                    .attr('x', d => xScale(xValue(d)) + yScale.bandwidth() / 2)
                    .attr('y', d => yScale(yValue(d)) + yScale.bandwidth() / 2 - 7.5)
                    .attr('dy', '1em');
            }
            chartContainer
                .append('g')
                .attr('class', 'axis axis-x')
                .call(d3.axisTop(xScale).tickSize(0));
            chartContainer
                .append('g')
                .attr('class', 'axis axis-y')
                .attr('transform', `translate(-${ margin.left }, 0)`)
                .attr('defaultScroll', `-${ margin.left }`)
                .append('rect')
                .attr('width', margin.left + 100)
                .attr('height', h)
                .attr('fill', 'white')
                .attr('transform', `translate(-100, -${ h - innerHeight })`);
            chartContainer
                .select('.axis-y')
                .append('g')
                .attr('transform', `translate(${ window.innerWidth >= 500 ? 67 : 23 }, 0)`)
                .call(d3.axisLeft(yScale).tickSize(0));
        },
        [data.length, width, chartActive, percentActive],
    );
    /**
     * Effects
     */
    useEffect(() => {
        if (refChart.current && refSwitch.current && scrolls['heatmapChart']) {
            if (scrolls['heatmapChart'].scrollX !== 0) {
                const el = refChart.current.querySelector('.axis-y');
                const defaultScroll = el.getAttribute('defaultScroll');
                el.setAttribute('transform', `translate(${ scrolls['heatmapChart'].scrollX + parseFloat(defaultScroll) }, 0)`);
                refSwitch.current.style.left = `${  scrolls['heatmapChart'].scrollX + parseFloat(refSwitch.current.getAttribute('defaultScroll')) }px`;
            }
        }
    }, [useStore.getState().iScroll]);
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
            <div className="dataviz">
                <svg
                    ref={ refChart }
                    width={ width }
                    height={ height }
                    // viewBox={ `0 0 ${ height } ${ width }` }
                    className="chart chart-heatmap"
                />
                <div ref={ refSwitch } className="switch-container">
                    <button className={ `button button-switch ${ chartActive ? 'is-active' : '' }` } onClick={
                        () => {
                            setChartActive(!chartActive);
                            setPercentActive(!percentActive);
                        }
                    }>
                        <Chart />
                    </button>
                    <button className={ `button button-switch ${ percentActive ? 'is-active' : '' }` } onClick={
                        () => {
                            setChartActive(!chartActive);
                            setPercentActive(!percentActive);
                        }
                    }>
                        <Percent />
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChartHeatmap;
