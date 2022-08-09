// React
import React, { useEffect, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import wrap from '@/utils/wrapTextSVG';

// CSS
import './style.scoped.scss';

function ChartBar(props, ref) {
    /**
     * Data
     */
    const { language } = useI18next();
    const { chart } = props;
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    const data = chart.fields;
    const xValue = d => d.value;
    const yValue = d => d.name;
    const xSubvalue = d => d.additionalInformation;
    const heightBar = 16;
    const paddingBar = 27;
    const lengthY = data.map(yValue).filter((item, pos) => data.map(yValue).indexOf(item) == pos).length;
    /**
     * States
     */
    const [margin, setMatgin] = useState({
        top: 30,
        right: language !== 'ar-QA' ? window.innerWidth >= 500 ? 67 : 23 : window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499,
        bottom: 0,
        left:language !== 'ar-QA' ? window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 : window.innerWidth >= 500 ? 67 : 23,
    });
    const [height, setHeight] = useState((heightBar + paddingBar) * lengthY + margin.top + margin.bottom);
    /**
    * References
    */
    const refChart = useD3(
        (svg) => {
            svg.select('.chart-container').remove();
            const w = refChart.current.clientWidth;
            const h = height;
            const innerWidth = w - margin.left - margin.right;
            const innerHeight = h - margin.top - margin.bottom;
            const xScale = d3
                .scaleLinear()
                .domain(language !== 'ar-QA' ? [0, d3.max(data, xValue)] : [d3.max(data, xValue), 0])
                .range(language !== 'ar-QA' ? [5, innerWidth - 120] : [innerWidth - 120, 5]);
            const yScale = d3
                .scaleBand()
                .domain(data.map(yValue))
                .range([0, innerHeight])
                .padding(0.2);
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ language !== 'ar-QA' ? margin.left : margin.right }, ${ margin.top })`);
            chartContainer
                .append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(${ language !== 'ar-QA' ? -(margin.left - (window.innerWidth >= 500 ? 67 : 23)) : innerWidth },0)`)
                .call(language !== 'ar-QA' ? d3.axisLeft(yScale).tickSize(0) : d3.axisRight(yScale).tickSize(0));
            const ticks = d3
                .selectAll('.tick text')
                .attr('class', 'p4')
                .attr('y', -7)
                .call(wrap, (window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499) / 2, true);
            const barsContainer = chartContainer
                .append('g')
                .attr('class', 'bars-container');
            const barContainer = barsContainer
                .selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'bar-container')
                .attr('transform', d => `translate(0,${ yScale(yValue(d)) })`);
            barContainer
                .append('rect')
                .attr('class', 'bar')
                .attr('width', d => xScale(xValue(d)))
                .attr('height', heightBar)
                .attr('x', d => language !== 'ar-QA' ? 0 : xScale(d3.max(data, xValue)) - xScale(xValue(d)));
            barContainer
                .append('text')
                .attr('class', 'p2 label')
                .text(d => xValue(d))
                .attr('x', d => language !== 'ar-QA' ? xScale(xValue(d)) + 11 : xScale(d3.max(data, xValue)) - xScale(xValue(d)) - 11)
                .attr('y', d => yScale.bandwidth() / 2)
                .attr('dy', '0');
            barContainer
                .append('text')
                .attr('class', 'p6 sublabel')
                .text(d => xSubvalue(d))
                .attr('x', d => language !== 'ar-QA' ? xScale(xValue(d)) + 11 : xScale(d3.max(data, xValue)) - xScale(xValue(d)) - 11)
                .attr('y', d => yScale.bandwidth())
                .attr('dy', '0');
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
        setMatgin({
            top: 0,
            right: language !== 'ar-QA' ? window.innerWidth >= 500 ? 67 : 23 : window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499,
            bottom: 0,
            left:language !== 'ar-QA' ? window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 : window.innerWidth >= 500 ? 67 : 23,
        });
    }
    return (
        <svg
            ref={ refChart }
            height={ height }
            className="chart chart-bar"
        />
    );
}

export default ChartBar;
