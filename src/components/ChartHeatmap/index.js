// React
import React, { useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useStore from '@/hooks/useStore';

// Utils
import wrap from '@/utils/wrapTextSVG';

// CSS
import './style.scoped.scss';

// Icon
import Chart from '@/assets/icons/chart.svg';
import Percent from '@/assets/icons/percent.svg';

function ChartHeatmap(props, ref) {
    /**
     * Store
     */
    const [scrolls, iScroll, themeCategory] = useStore((state) => [state.scrolls, state.iScroll, state.themeCategory]);
    /**
     * Datas
     */
    const { language } = useI18next();
    const { chart } = props;
    const data = chart.fields;
    const value = d => d.value;
    const percent = d => d.percent;
    const xValue = d => d.name;
    const yValue = d => d.group;
    const sizeCircle = 43;
    const paddingCircle = 13;
    const lengthX = data.map(xValue).filter((item, pos) => data.map(xValue).indexOf(item) == pos).length;
    const lengthY = data.map(yValue).filter((item, pos) => data.map(yValue).indexOf(item) == pos).length;
    let margin = {
        top: 100,
        right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 67 : 23) : (window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499),
        bottom: 0,
        left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499) : (window.innerWidth >= 500 ? 67 : 23),
    };
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
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const parentWidth = refChart.current.clientWidth;
            const w = width;
            const h = height;
            const innerWidth = w - margin.left - margin.right;
            const innerHeight = h - margin.top - margin.bottom;
            const svg = dataviz.select('svg');
            const xScale = d3
                .scaleBand()
                .range(language !== 'ar-QA' ? [ 0, innerWidth ] : [ innerWidth, 0 ])
                .domain(data.map(xValue).filter((item, pos) => data.map(xValue).indexOf(item) == pos))
                .padding(0.2);
            const yScale = d3
                .scaleBand()
                .range([ 0, innerHeight ])
                .domain(data.map(yValue).filter((item, pos) => data.map(yValue).indexOf(item) == pos))
                .padding(0.2);
            const percentScale = d3
                .scaleLinear()
                .range([0.25, 1])
                .domain([d3.min(data, value), d3.max(data, value)]);
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ language !== 'ar-QA' ? margin.left : margin.left }, ${ margin.top })`);
            const colorTheme = getComputedStyle(document.querySelector(`.${ themeCategory }`)).getPropertyValue('--color-theme-secondary');
            const myColor = d3.scaleLinear()
                .range([`${ colorTheme }4D`, colorTheme])
                .domain([0, 100]);
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseover = function(d) {
                tooltip.style('opacity', 1);
            };
            const mousemove = function(e, d) {
                tooltip.classed('tooltip-label', false);
                tooltip
                    .html(`<p class="p3">${ d.value }</p><p class="p4">${ d.group }</p>`)
                    .style('left', `${ e.target.cx.baseVal.value + margin.left - (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ e.target.cy.baseVal.value + margin.top - sizeCircle }px`);
            };
            const mousemoveLabel = function(e, d) {
                const parent = e.target.parentNode.parentNode;
                const parentBounding = parent.getBoundingClientRect();
                const parentTranslate = parent.getAttribute('transform').replace(/[^\d.,]/g, '').split(',');
                tooltip
                    .classed('tooltip-label', true)
                    .html(`<p class="p6">${ d }</p>`)
                    .style('left', `${ parseFloat(parentTranslate[0]) + margin.left + (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ parseFloat(parentTranslate[1]) - parentBounding.height / 2 + margin.top - sizeCircle }px`);
            };
            const mouseleave = function(d) {
                tooltip.style('opacity', 0);
            };
            const switchContainer = d3
                .select('.switch-container')
                .attr('defaultScroll', `${  (window.innerWidth >= 500 ? 67 : 23) }`)
                .style(language !== 'ar-QA' ? 'left' : 'right', `${ (window.innerWidth >= 500 ? 67 : 23) }px`)
                .style('top', `${ 32 }px`);
            const circlesContainer = chartContainer
                .append('g')
                .attr('class', 'circles-container');
            if (chartActive) {
                circlesContainer.selectAll()
                    .data(data, function(d) {return d.group + ':' + d.name;})
                    .enter()
                    .append('circle')
                    .attr('class', 'circle circle-graph can-hover')
                    .attr('cx', d => xScale(xValue(d)) + yScale.bandwidth() / 2)
                    .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
                    .attr('r', d => yScale.bandwidth() / 2 * percentScale(d.value))
                    .style('fill', function(d) { return myColor(percent(d));})
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseleave', mouseleave);
            }
            if (percentActive) {
                circlesContainer.selectAll()
                    .data(data, function(d) {return d.group + ':' + d.name;})
                    .enter()
                    .append('circle')
                    .attr('class', 'circle circle-percent')
                    .attr('cx', d => xScale(xValue(d)) + yScale.bandwidth() / 2)
                    .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
                    .attr('r', d => yScale.bandwidth() / 2)
                    .style('stroke', function(d) { return myColor(percent(d));})
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseleave', mouseleave);
                circlesContainer.selectAll()
                    .data(data, function(d) {return d.group + ':' + d.name;})
                    .enter()
                    .append('text')
                    .text(d => percent(d))
                    .attr('class', 'p6 label')
                    .attr('x', d => xScale(xValue(d)) + yScale.bandwidth() / 2)
                    .attr('y', d => yScale(yValue(d)) + yScale.bandwidth() / 2)
                    .attr('dy', '0.82em');
            }
            chartContainer
                .append('g')
                .attr('class', 'axis axis-x')
                .call(d3.axisTop(xScale).tickSize(0))
                .selectAll('.tick text')
                .call((texts) => {
                    texts.each(function() {
                        const text = d3.select(this);
                        const maxLength = 19;
                        if (text.text().length > maxLength) {
                            let trimmedString = text.text().substr(0, maxLength);
                            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
                            trimmedString = trimmedString == '' ? text.text().split(' ')[0] : trimmedString;
                            text.on('mouseover', mouseover)
                                .on('mousemove', mousemoveLabel)
                                .on('mouseleave', mouseleave);
                            text.text(trimmedString + '\u00a0...');
                        }
                    });
                })
                .call(wrap, yScale.bandwidth(), true);
            chartContainer
                .append('g')
                .attr('class', 'axis axis-y')
                .attr('transform', `translate(${ language !== 'ar-QA' ? -margin.left : -margin.left + margin.right }, 0)`)
                .attr('defaultScroll', `${ language !== 'ar-QA' ? -margin.left : -margin.left + margin.right }`)
                .append('rect')
                .attr('width', language !== 'ar-QA' ? margin.left + 100 : margin.right + 100)
                .attr('height', h)
                .attr('fill', 'white')
                .attr('transform', `translate(${ language !== 'ar-QA' ? -100 : innerWidth + margin.left - margin.right }, -${ h - innerHeight })`);
            chartContainer
                .select('.axis-y')
                .append('g')
                .attr('transform', `translate(${ language !== 'ar-QA' ? ((window.innerWidth >= 500 ? 67 : 23)) : innerWidth },0)`)
                .call(language !== 'ar-QA' ? d3.axisLeft(yScale).tickSize(0) : d3.axisRight(yScale).tickSize(0))
                .selectAll('.tick text')
                .call(wrap, (window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499) / 2, true);
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
                if (language !== 'ar-QA') {
                    refSwitch.current.style.left = `${  scrolls['heatmapChart'].scrollX + parseFloat(refSwitch.current.getAttribute('defaultScroll')) }px`;
                } else {
                    refSwitch.current.style.right = `${  -scrolls['heatmapChart'].scrollX + parseFloat(refSwitch.current.getAttribute('defaultScroll')) }px`;
                }
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
        margin = {
            top: 100,
            right: language !== 'ar-QA' ? window.innerWidth >= 500 ? 67 : 23 : window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499,
            bottom: 0,
            left: language !== 'ar-QA' ? window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 : window.innerWidth >= 500 ? 67 : 23,
        };
        setWidth((sizeCircle + paddingCircle) * lengthX + margin.right + margin.left);
        setHeight((sizeCircle + paddingCircle) * lengthY + margin.top + margin.bottom);
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    width={ width }
                    height={ height }
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
