// React
import React, { useEffect, useRef } from 'react';

// Hooks
import useStore from '@/hooks/useStore';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import Scrolls from '@/utils/Scrolls';

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
     * Hooks
     */
    useWindowResizeObserver(() => {
        if (!refScrollBar.current) return;

        scrolls[refScrollBar.current.parentNode.dataset.name].scrollWidth = refScrollBar.current.scrollWidth;
        scrolls[refScrollBar.current.parentNode.dataset.name].innerHeight = window.innerWidth;
        scrolls[refScrollBar.current.parentNode.dataset.name].scrollHeight = refScrollBar.current.scrollHeight;
        scrolls[refScrollBar.current.parentNode.dataset.name].innerHeight = window.innerHeight;

        useStore.setState({
            scrolls,
        });
    });

    /**
     * Effects
     */
    useEffect(() => {
        if (refScrollBar.current) {
            scrolls[refScrollBar.current.parentNode.dataset.name] = {
                scrollX: 0,
                scrollY: 0,
                scrollWidth: refScrollBar.current.scrollWidth,
                innerWidth: window.innerWidth,
                scrollHeight: refScrollBar.current.scrollHeight,
                innerHeight: window.innerHeight,
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
                    scrolls[e.target.parentNode.dataset.name].scrollX = e.target.scrollLeft;
                    // scrolls[e.target.parentNode.dataset.name].scrollWidth = e.target.scrollWidth;
                    scrolls[e.target.parentNode.dataset.name].scrollY = e.target.scrollTop;
                    // scrolls[e.target.parentNode.dataset.name].scrollHeight = e.target.scrollHeight;
                    // useStore.setState({ scrolls, iScroll: iScroll + 1 });
                    Scrolls.data = scrolls;
                }
            }>
                { props.children }
            </div>
        </>
    );
}

export default Scrollbar;
