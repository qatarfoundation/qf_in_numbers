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

function ChartBeeswarm(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();
    const { chart } = props;
    const data = chart.fields;
    const radiusPoint = 12;
    const heightTooltip = 80;
    const spaceTooltip = 10;
    const heightAxisX = 25;
    const spaceAxisX = 20;
    /**
     * States
     */
    const [isResize, setIsResize] = useState(false);
    const [margin, setMargin] = useState({
        top: 0 + heightTooltip + spaceTooltip,
        right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) + radiusPoint : (window.innerWidth >= 500 ? 58 : 18) + radiusPoint,
        bottom: 30 + heightAxisX + spaceAxisX,
        left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) + radiusPoint : (window.innerWidth >= 500 ? 58 : 18) + radiusPoint,
    });
    const [height, setHeight] = useState(55 + margin.top + margin.bottom);
    /**
    * References
    */
    const refSwitch = useRef();
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const svg = dataviz.select('svg');
            const width = refChart.current.querySelector('svg').clientWidth;
            const innerWidth = width - margin.left - margin.right;
            // Height
            const lengthCases = Math.floor(innerWidth / (radiusPoint * 2));
            const lengthCasesScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([ 0, lengthCases ]);
            const newXScale = d3.scaleLinear()
                .domain([0, lengthCases])
                .range(language !== 'ar-QA' ? [ 0, innerWidth ] : [ innerWidth, 0 ]);
            data.forEach((d, i) => {
                d.x = newXScale(Math.floor(lengthCasesScale(d.value)));
            });
            const duplicated = data.reduce((acc, curr) => {
                if (!acc.length) {
                    acc.push([curr.x, 1, 0]);
                } else {
                    const lastPushedArray = acc[acc.length - 1];
                    if (lastPushedArray[0] === curr.x) {
                        acc[acc.length - 1][1]++;
                        acc[acc.length - 1][2]++;
                    } else {
                        acc.push([curr.x, 1, 0]);
                    }
                }
                return acc;
            }, []);
            const maxPointSameGroup = d3.max(duplicated, d => d[2]);
            const h = (maxPointSameGroup * (radiusPoint * 2)) + margin.top + margin.bottom;
            setHeight(h);
            const innerHeight = h - margin.top - margin.bottom;
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${ margin.left }, ${ margin.top })`);
                // Add X axis
            const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range(language !== 'ar-QA' ? [ 0, innerWidth ] : [ innerWidth, 0 ]);
            chartContainer.append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', `translate(0, ${ innerHeight + spaceAxisX })`)
                .call(d3.axisBottom(x).tickSize(0).tickValues(language !== 'ar-QA' ? [0, d3.max(data, d => d.value)] : [d3.max(data, d => d.value), 0]));
            // Add Y axis
            const y = d3.scaleLinear()
                .domain([-maxPointSameGroup / 2, maxPointSameGroup / 2])
                .range([ innerHeight, 0 ]);
            const axisY = chartContainer.append('g')
                .attr('class', 'axis axis-y')
                .attr('transform', `translate(${ -((window.innerWidth >= 500 ? 7 : 4)) }, 0)`)
                .call(d3.axisLeft(y).tickSize(0).tickFormat(''));
            chartContainer.append('g')
                .attr('class', 'grid grid-y')
                .call(d3.axisLeft(y)
                    .ticks(1)
                    .tickSize(-innerWidth)
                    .tickFormat(''),
                );
            data.map((d) => {
                duplicated.map((n) => {
                    if (d.x == n[0]) {
                        n[1] -= 1;
                        if (n[2]) {
                            d.y = 0 + (1 * n[1]) - (0.5 * n[2]);
                        } else {
                            d.y = 0;
                        }
                    }
                });
                return d;
            });
            // Tooltip
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const tooltipContainer = tooltip.append('div');
            const arrow = tooltip.append('div').attr('class', 'arrow');
            const mouseover = d => tooltip.style('opacity', 1);
            const mousemove = (e, d) => {
                tooltip
                    .style('background-color', e.target.getAttribute('fill'))
                    .style('left', `${ e.target.cx.baseVal.value + margin.left - (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ e.target.cy.baseVal.value + margin.top - radiusPoint - spaceTooltip }px`);
                tooltipContainer
                    .html(`<p class="p3">${ d.y }</p><p class="p4">${ d.group }</p>`);
                arrow
                    .style('border-top', `9px solid ${ e.target.getAttribute('fill') }`);
            };
            const mouseleave = d => tooltip.style('opacity', 0);
            // Points Container : contain all points of a line
            const pointsContainer = chartContainer
                .append('g')
                .attr('class', 'points-container');
            // Add the points
            pointsContainer
                // Point
                .selectAll('myPoints')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'point')
                .attr('cx', d => {
                    return newXScale(Math.floor(lengthCasesScale(d.value)));
                })
                .attr('cy', d => y(d.y))
                .attr('r', radiusPoint)
                .attr('fill', d => d.color ? d.color : '#6ECEB2')
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave);
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
            top: 0 + heightTooltip + spaceTooltip,
            right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) + radiusPoint : (window.innerWidth >= 500 ? 58 : 18) + radiusPoint,
            bottom: 30 + heightAxisX + spaceAxisX,
            left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) + radiusPoint : (window.innerWidth >= 500 ? 58 : 18) + radiusPoint,
        });
        setIsResize(!isResize);
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    height={ height }
                    className="chart chart-beeswarm"
                />
            </div>
        </>
    );
}

export default ChartBeeswarm;
