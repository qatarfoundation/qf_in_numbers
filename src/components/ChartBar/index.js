// React
import React, { useEffect, useState } from 'react';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';

function ChartBar(props, ref) {
    /**
     * Datas
     */
    const { chart } = props;
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    const data = [
        { title: 'Gold', value: getRandomArbitrary(0, 1000000), additionalInformation: Math.random() > 0.5 ? `${ getRandomArbitrary(0, 100) }% of disclosures` : ''  },
        { title: 'Silver', value: getRandomArbitrary(0, 1000000), additionalInformation: Math.random() > 0.5 ? `${ getRandomArbitrary(0, 100) }% of disclosures` : '' },
        { title: 'Bronze', value: getRandomArbitrary(0, 1000000), additionalInformation: Math.random() > 0.5 ? `${ getRandomArbitrary(0, 100) }% of disclosures` : '' },
    ];
    const xValue = d => d.value;
    const yValue = d => d.title;
    const xSubvalue = d => d.additionalInformation;
    const heightBar = 16;
    const paddingBar = 27;
    const lengthY = data.map(yValue).filter((item, pos) => data.map(yValue).indexOf(item) == pos).length;
    // const margin = { top: 0, right: window.innerWidth >= 500 ? 67 : 23, bottom: 0, left: window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 };
    /**
     * States
     */
    const [margin, setMatgin] = useState({ top: 0, right: window.innerWidth >= 500 ? 67 : 23, bottom: 0, left: window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 });
    const [height, setHeight] = useState((heightBar + paddingBar) * lengthY + margin.top + margin.bottom);
    console.log('d3', height);
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
            console.log('d3', margin.top, margin.bottom);
            const xScale = d3
                .scaleLinear()
                .domain([0, d3.max(data, xValue)])
                .range([0, innerWidth - 120]);
            const yScale = d3
                .scaleBand()
                .domain(data.map(yValue))
                .range([0, innerHeight])
                .padding(0.2);
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
            chartContainer
                .append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(-${ margin.left - (window.innerWidth >= 500 ? 67 : 23) },0)`)
                .call(d3.axisLeft(yScale).tickSize(0));
            const ticks = d3
                .selectAll('.tick text')
                .attr('class', 'p4');
            const barsContainer = chartContainer
                .append('g')
                .attr('class', 'bars-container');
            const barContainer = barsContainer
                .selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'bar-container')
                .attr('transform', d => `translate(0,${ yScale(yValue(d)) })`)
                .attr('y', d => yScale(yValue(d)));
            barContainer
                .append('rect')
                .attr('class', 'bar')
                .attr('width', d => xScale(xValue(d)))
                .attr('height', heightBar);
            barContainer
                .append('text')
                .attr('class', 'p2 label')
                .text(d => xValue(d))
                .attr('x', d => xScale(xValue(d)) + 11)
                .attr('y', d => yScale.bandwidth() / 2)
                .attr('dy', '0');
            barContainer
                .append('text')
                .attr('class', 'p6 sublabel')
                .text(d => xSubvalue(d))
                .attr('x', d => xScale(xValue(d)) + 11)
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
        setMatgin({ top: 0, right: window.innerWidth >= 500 ? 67 : 23, bottom: 0, left: window.innerWidth >= 500 ? window.innerWidth >= 1440 ? 353 : window.innerWidth * 353 / 1440 : window.innerWidth * 200 / 499 });
        // setWidth('100%');
        // setWidth(refChart.current.clientWidth);
    }
    return (
        <svg
            ref={ refChart }
            height={ height }
            // viewBox={ `0 0 ${ height } ${ width }` }
            className="chart chart-bar"
        />
    );
}

export default ChartBar;
