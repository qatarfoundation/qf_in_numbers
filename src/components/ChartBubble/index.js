// React
import React, { useEffect, useRef, useState } from 'react';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

// Modules
import { useD3 } from '@/hooks/useD3';
import * as d3 from 'd3';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// CSS
import './style.scoped.scss';
import useStore from '@/hooks/useStore';

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
        .range([12, 85]);
    let test = 0;
    data.forEach(d => {
        test += s(d.value);
    });
    const { t } = useTranslation();
    /**
     * Stores
     */
    const themeColors = useStore((state) => state.themeColors);
    /**
     * States
     */
    const [isResize, setIsResize] = useState(false);
    const [margin, setMargin] = useState({
        top: heightTooltip + spaceTooltip,
        right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
        bottom: 10,
        left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
    });
    /**
    * References
    */
    const refChart = useD3(
        (dataviz) => {
            dataviz.select('.chart-container').remove();
            dataviz.select('.tooltip').remove();
            const svg = dataviz.select('svg');
            const width = refChart.current.querySelector('svg').clientWidth;
            const height = refChart.current.querySelector('svg').clientHeight;
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            // Tooltip
            const tooltip = dataviz
                .append('div')
                .style('opacity', 0)
                .attr('class', 'tooltip')
                .html('<p class="p3"><span class="p3">000</span> <span class="p6">dummy</span></p><p class="p4">dummy</p>');

            const paddingTop = tooltip._groups[0][0].offsetHeight + 20;

            tooltip.html('');

            const bubble = d3.pack()
                .size([width, height - paddingTop])
                .padding(1.5);
            const root = d3.hierarchy({ children: data })
                .sum(function(d) {
                    return d.value;
                })
                .sort(function(a, b) {
                    return b.value - a.value;
                });
            bubble(root);

            const mouseover = (e, d) => {
                const el = e.currentTarget,
                    x = el.dataset.positionX,
                    y = el.dataset.positionY,
                    r = el.dataset.radius,
                    text = el.querySelector('text');
                tooltip
                    .html(`<p class="p3"><span class="p3">${ d.value }</span> <span class="p6">${ chart.labelTooltip ? chart.labelTooltip : '' }</span></p>${ text.classList.contains('is-hidden') ? `<p class="p4">${ d.data.name }</p>` : '' }`)
                    .style('left', `${ x - (language !== 'ar-QA' ? 0 : refChart.current.querySelector('svg').clientWidth - refChart.current.clientWidth) }px`)
                    .style('top', `${ y - r - spaceTooltip }px`)
                    .style('opacity', 1);
            };
            const mouseleave = (e, d) => tooltip.style('opacity', 0);
            // Chart Container : contain all svg
            const chartContainer = svg
                .append('g')
                .attr('class', 'chart-container');
            const colorTheme = themeColors.secondary;
            const color = d3.scaleLinear()
                .range([`${ colorTheme }4D`, colorTheme])
                .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);
            const size = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([12, 85]);

            const node = chartContainer.selectAll('circle')
                .data(root.children)
                .enter().append('g')
                .attr('class', 'node')
                .attr('data-position-x', function(d) { return d.x; })
                .attr('data-position-y', function(d) { return d.y + paddingTop; })
                .attr('data-radius', d => d.r)
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + (d.y + paddingTop) + ')'; })
                .on('mouseover', mouseover)
                .on('mouseleave', mouseleave);

            node.append('circle')
                .attr('r', function(d) { return d.r; })
                .style('fill', function(d) {
                    return color(d.value);
                });

            const text = node.append('text')
                .attr('dy', '.3em')
                .text(function(d) { return d.data.name; })
                .style('text-anchor', 'middle')
                .attr('class', 'p4 label')
                .attr('class', function(d) {
                    const circleWidth = this.parentNode.querySelector('circle').getBBox().width;
                    if (this.getBBox().width + 10 > circleWidth) this.textContent = '+';
                    return `p4 label ${ circleWidth < 15 ? 'is-hidden' : '' }`;
                });
        },
        [data.length, margin, themeColors],
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
            top: heightTooltip + spaceTooltip,
            right: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
            bottom: 10,
            left: language !== 'ar-QA' ? (window.innerWidth >= 500 ? 58 : 18) : (window.innerWidth >= 500 ? 58 : 18),
        });
    }
    return (
        <>
            <div ref={ refChart } className="dataviz">
                <svg
                    className="chart chart-bubble"
                />
                <div className="info">
                    <div className="info__icon">i</div>
                    <span className="info__text">{ t('Hover the bubble') }</span>
                </div>
            </div>
        </>
    );
}

export default ChartBubble;
