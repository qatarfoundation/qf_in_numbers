// React
import React, { useEffect, useRef } from 'react';

// Hooks
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

function Scrollbar({ revert = false, colored = true, ...props }, ref) {
    /**
     * Store
     */
    const [scrolls, iScroll] = useStore((state) => [state.scrolls, state.iScroll]);
    /**
     * References
     */
    const refScrollBar = useRef();
    /**
     * Effects
     */
    useEffect(() => {
        if (refScrollBar.current) {
            scrolls[refScrollBar.current.parentNode.dataset.name] = {
                scrollX: 0,
                scrollY: 0,
            };
            useStore.setState({
                scrolls,
            });
        }
    }, [refScrollBar]);
    return (
        <>
            <div ref={ refScrollBar } className={ `scrollbar ${ revert ? 'scrollbar-revert' : '' } ${ colored ? 'scrollbar-colored' : '' }` } onScroll={
                (e) => {
                    scrolls[e.target.parentNode.dataset.name] = {
                        scrollX: e.target.scrollLeft,
                        scrollY: e.target.scrollTop,
                        scrollWidth: e.target.scrollWidth,
                        scrollHeight: e.target.scrollHeight,
                    };
                    useStore.setState({ scrolls, iScroll: iScroll + 1 });
                }
            }>
                { props.children }
            </div>
        </>
    );
}

export default Scrollbar;
