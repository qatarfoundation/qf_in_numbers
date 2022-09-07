// React
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import wrap from '@/utils/wrapTextSVG';
import Breakpoints from '@/utils/Breakpoints';
import number from '@/utils/number';

// CSS
import './style.scoped.scss';
import useStore from '@/hooks/useStore';

function ChartDonut(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();
    const { chart } = props;
    const data = chart.fields;

    let sizeCircle = window.innerWidth >= 500 ? 232 : 172;
    const widthStroke = 20;
    let margin = calcMargin();

    /**
     * Refs
     */
    const labelsRef = useRef([]);
    const arcActiveRef = useRef();
    const hiddenLabelRef = useRef();

    /**
     * States
     */
    const [width, setWidth] = useState(sizeCircle + margin.right + margin.left);
    const [height, setHeight] = useState(sizeCircle + margin.top + margin.bottom);
    const [labelPosition, setLabelPosition] = useState(Breakpoints.active('small') ? { top: 23, width: 90 } : { top: 30, width: 140 });

    /**
     * Stores
     */
    const themeCategory = useStore(s => s.themeCategory);
    /**
    * References
    */
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            const w = width;
            const h = height;
            // const innerWidth = w - margin.left - margin.right;
            // const innerHeight = h - margin.top - margin.bottom;
            const svg = dataviz.select('svg');
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');
            const percent = d3.scaleLinear()
                .domain([0, data.length])
                .range([0, 100]);
            const colorTheme = getComputedStyle(document.querySelector(`.${ themeCategory }`)).getPropertyValue('--color-theme-secondary');
            const color = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([`${ colorTheme }4D`, colorTheme]);
            const pie = d3.pie()
                .value(d => d.value).sort(null);
            const data_ready = pie(data);
            const donutContainer = chartContainer
                .append('g')
                .attr('class', 'donut-container');
            const legendContainer = donutContainer
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
                .attr('y', labelPosition.top)
                .attr('dy', '0.15em');
            legendContainer.selectAll('.p7')
                .call(wrap, labelPosition.width, false, 30);
            const outerArc = d3.arc()
                .innerRadius(((sizeCircle / 2) + (48 / 2)) * (window.innerWidth >= 500 ? 1.05 : 0.95))
                .outerRadius(((sizeCircle / 2) + (48 / 2)) * (window.innerWidth >= 500 ? 1.05 : 0.95));
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip');
            const mouseenter = function(e, d) {
                donutContainer
                    .selectAll('.arc, .label-container')
                    .style('opacity', (el) => {
                        return d.index === el.index ? 1 : 0.2;
                    });
                e.target.classList.add('active');
                arcActiveRef.current = e.target;
                if (e.target.classList.contains('has-tooltip')) {
                    const arc = d3.arc()
                        .innerRadius((sizeCircle / 2) * (window.innerWidth >= 500 ? 1.05 : 1.05))
                        .outerRadius((sizeCircle / 2) * (window.innerWidth >= 500 ? 1.05 : 1.05));
                    const x = arc.centroid(d)[0] + (w / 2);
                    const y = arc.centroid(d)[1] + (h / 2);

                    hiddenLabelRef.current = labelsRef.current[d.index];
                    gsap.to(hiddenLabelRef.current, { duration: 0.2, alpha: 0, ease: 'sine.inOut' });

                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    const sideHorizontal = (midangle < Math.PI ? 'right' : 'left');
                    const sideVertical = midangle > Math.PI * 0.5 && midangle < Math.PI * 1.5 ? 'bottom' : 'top';

                    tooltip
                        .html(`<div class="content ${ sideHorizontal } ${ sideVertical }"><p class="p3">${ d.data.value }</p><p class="p4">${ d.data.name }</p><div>`)
                        .style('left', `${ x }px`)
                        .style('top', `${ y }px`);
                    tooltip.style('opacity', 1);
                }
            };
            const mouseleave = function(e) {
                arcActiveRef.current.classList.remove('active');
                donutContainer
                    .selectAll('.arc, .label-container')
                    .style('opacity', (el) => {
                        return number.map(el.data.percent / 100, 0, 1, 0.3, 1);
                    });
                if (e.target.classList.contains('has-tooltip')) {
                    tooltip.style('opacity', 0);
                }

                if (hiddenLabelRef.current) {
                    gsap.to(hiddenLabelRef.current, { duration: 0.4, alpha: 1, ease: 'sine.inOut' });
                }
            };
            donutContainer
                .selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('class', function(d) {
                    const hasTooltip = d.endAngle - d.startAngle <= Math.PI / 6;
                    // return `arc ${ hasTooltip ? 'has-tooltip' : '' }`;
                    return 'arc has-tooltip';
                })
                .attr('d', d3.arc()
                    .innerRadius(sizeCircle / 2 - widthStroke)
                    .outerRadius(sizeCircle / 2),
                )
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                .style('opacity', (el) => {
                    return number.map(el.data.percent / 100, 0, 1, 0.3, 1);
                })
                .on('mouseenter', mouseenter)
                .on('mouseleave', mouseleave);
            const labelContainer = donutContainer
                .selectAll('allLabels')
                .data(data_ready)
                .enter()
                .append('g')
                .attr('class', function(d) {
                    const isHide = d.endAngle - d.startAngle <= Math.PI / 6;
                    return `label-container ${ isHide ? 'is-hidden' : '' }`;
                })
                .attr('transform', function(d) {
                    const position = outerArc.centroid(d);

                    const index = d.index;
                    const element = labelsRef.current[index];
                    const offset = Breakpoints.active('small') ? 5 : 12;
                    const x = position[0] + offset * (position[0] > 0 ? -1 : 1);
                    const y = position[1] + offset * (position[1] > 0 ? -1 : 1);
                    element.style.transform = `translate(${ x }px, ${ y }px)`;

                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    const sideHorizontal = (midangle < Math.PI ? 'right' : 'left');
                    // const sideHorizontal = language === 'ar-QA' ? (midangle < Math.PI ? 'right' : 'left') : (midangle < Math.PI ? 'left' : 'right');
                    const sideVertical = midangle > Math.PI * 0.5 && midangle < Math.PI * 1.5 ? 'bottom' : 'top';
                    element.children[0].classList.add(sideHorizontal, sideVertical);

                    return 'translate(' + position + ')';
                });
            // labelContainer
            //     .append('rect').attr('width', 2).attr('height', 2).attr('fill', 'red');
        },
        [data.length, width, themeCategory],
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
        margin = calcMargin();
        sizeCircle = window.innerWidth >= 500 ? 232 : 172;
        setWidth(sizeCircle + margin.right + margin.left);
        setHeight(sizeCircle + margin.top + margin.bottom);

        if (Breakpoints.active('small')) {
            setLabelPosition(23, 90);
        } else {
            setLabelPosition(30, 140);
        }
    }

    function calcMargin() {
        return {
            top: Breakpoints.active('small') ? 50 : 100,
            right: language !== 'ar-QA' ? 75 + (window.innerWidth >= 500 ? 62 : 18) : 75 + (window.innerWidth >= 500 ? 62 : 18),
            bottom: Breakpoints.active('small') ? 25 : 75,
            left: language !== 'ar-QA' ? 75 + (window.innerWidth >= 500 ? 62 : 18) : 75 + (window.innerWidth >= 500 ? 62 : 18),
        };
    }

    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    width={ width }
                    height={ height }
                    className="chart chart-donut"
                />

                <ul className="labels">
                    {
                        data.map((item, index) => {
                            return (
                                <li key={ index } ref={ (el) => labelsRef.current[index] = el } className={ item.percent < 5 ? 'hide' : '' }>
                                    <div className="content">
                                        <span className="p3 value">{ item.value }</span>
                                        <span className="p6 label" title={ item.name }>{ item.name }</span>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </>
    );
}

export default ChartDonut;
