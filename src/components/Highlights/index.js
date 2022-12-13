// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useState, useRef } from 'react';

// CSS
import './style.scoped.scss';

function Highlights(props) {
    const { data = [] } = props;
    const elementRef = useRef();
    const animation = useRef();
    const [highlights, setHighlights] = useState([]);

    useEffect(function() {
        animation.current?.kill();
        if (highlights) {
            animation.current = new gsap.timeline();
            animation.current.to(elementRef.current, { duration: 0.3, opacity: 0, ease: 'sine.inOut' }, 0);
            animation.current.call(() => setHighlights(data), null, 0.3);
            animation.current.to(elementRef.current, { duration: 0.3, opacity: 1, ease: 'sine.inOut' }, 0.4);
        } else {
            animation.current.to(elementRef.current, { duration: 0.3, opacity: 1, ease: 'sine.inOut' });
        }
    }, [data]);

    return (
        <ul className="highlights" ref={ elementRef }>
            {
                highlights.map(function(highlight, index) {
                    return (
                        <li key={ index }>
                            <span className="title">{ highlight.title }</span>
                            <span className="value">{ highlight.value }</span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Highlights;
