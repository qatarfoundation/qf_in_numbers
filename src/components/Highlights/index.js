// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useState, useRef } from 'react';

// CSS
import './style.scoped.scss';
import { formatNumbers } from '@/utils/helpers/getChartTitle';

function Highlights(props) {
    const { data = [] } = props;
    const elementRef = useRef();
    const animation = useRef();
    const [highlights, setHighlights] = useState([]);
    let highlightNb = 0;

    useEffect(function() {
        animation.current?.kill();
        if (highlights) {
            animation.current = new gsap.timeline();
            let delay = 0;
            if (highlightNb > 0) {
                delay = .3;
                animation.current.to(elementRef.current, { duration: delay, opacity: 0, ease: 'sine.inOut' }, 0);
            }
            animation.current.call(() => setHighlights(data), null, delay);
            animation.current.to(elementRef.current, { duration: 0.3, opacity: 1, ease: 'sine.inOut' }, delay + 0.1);
        } else {
            if (!animation.current) animation.current = new gsap.timeline();
            animation.current.to(elementRef.current, { duration: 0.3, opacity: 1, ease: 'sine.inOut' });
        }
        highlightNb = highlights.length;
    }, [data]);

    return (
        <ul className="highlights" ref={ elementRef }>
            {
                highlights.map(function(highlight, index) {
                    return (
                        <li key={ index }>
                            <span className="title">{ highlight.title }</span>
                            <span className="value">{ formatNumbers(highlight.value) }</span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Highlights;
