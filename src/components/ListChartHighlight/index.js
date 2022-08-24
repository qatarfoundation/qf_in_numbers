// React
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

// CSS
import './style.scoped.scss';

function ListChartHighlight(props, ref) {
    const { charts } = props;
    const data = parseCharts(charts);

    const { language } = useI18next();

    const listRef = useRef();
    const itemsRef = useRef([]);

    const timelines = useRef({
        show: null,
        hide: null,
    });

    useEffect(() => {
        const handler = () => {
            for (let i = 0; i < itemsRef.current.length; i++) {
                const element = itemsRef.current[i];
                if (TreeDataModel.chartParticles[i]) {
                    const position = TreeDataModel.chartParticles[i].position;

                    const side =  TreeDataModel.chartParticles[i].side;
                    if (element) {
                        element.classList.add(side);

                        let x = position.x;
                        if (language === 'ar-QA') {
                            x = -(WindowResizeObserver.fullWidth - position.x);
                        }

                        element.style.transform = `translate(${ x }px, ${ position.y }px)`;
                    }
                }
            }
        };

        gsap.ticker.add(handler);

        return () => {
            gsap.ticker.remove(handler);
        };
    }, []);

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.to(listRef.current, { duration: 1, alpha: 1 }, 0);
        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(listRef.current, { duration: 0.5, alpha: 0 }, 0);
        return timelines.current.hide;
    }

    /**
     * Private
     */
    function parseCharts(charts) {
        const highlights = [];
        const grouped = groupCharts(charts);
        for (const key in grouped) {
            const group = grouped[key];
            for (let i = 0; i < group.length; i++) {
                const element = group[i];
                if (element.highlightedData) {
                    highlights.push(element.highlightedData);
                    break;
                }
            }
        }
        return highlights;
    }

    function groupCharts(charts) {
        const groups = {};
        if (charts) {
            for (let i = 0, len = charts.length; i < len; i++) {
                const item = charts[i];
                if (!groups[item.type]) {
                    groups[item.type] = [];
                }
                groups[item.type].push(item);
            }
        }
        return groups;
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    return (
        <ul className="list" ref={ listRef }>
            {
                data.map((item, index) => {
                    return (
                        <li key={ index } ref={ el => itemsRef.current[index] = el }>
                            <div className="content">
                                <span className="h5 value">{ item.value }</span>
                                <span className="p4 label">{ item.title }</span>
                            </div>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default forwardRef(ListChartHighlight);
