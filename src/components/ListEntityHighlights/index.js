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

function ListEntityHighlights(props, ref) {
    const data = [
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
        { label: 'Dummy data', value: 123 },
    ];

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
                const position = TreeDataModel.chartParticles[i].position;
                const side =  TreeDataModel.chartParticles[i].side;
                element.classList.add(side);

                let x = position.x;
                if (language === 'ar-QA') {
                    x = -(WindowResizeObserver.fullWidth - position.x);
                }

                element.style.transform = `translate(${ x }px, ${ position.y }px)`;
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
                                <span className="p4 label">{ item.label }</span>
                            </div>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default forwardRef(ListEntityHighlights);
