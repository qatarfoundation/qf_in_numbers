// React
import React, { useEffect, useRef } from 'react';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import Scrolls from '@/utils/Scrolls';

// CSS
import './style.scoped.scss';

function Scrollbar({ revert = false, colored = true, calcHeight = true, name = '', ...props }) {
    /**
     * References
     */
    const refScrollBar = useRef();

    /**
     * Hooks
     */
    useWindowResizeObserver(() => {
        resize();
    });

    /**
     * Effects
     */
    useEffect(() => {
        if (refScrollBar.current) {
            Scrolls[name] = {
                scrollX: 0,
                scrollY: 0,
            };
        }
    }, [refScrollBar]);

    useEffect(() => {
        resize();
    }, []);

    if (props.horizontalScroll) {
        useEffect(() => {
            const element = refScrollBar.current;
            const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
            if (hasHorizontalScrollbar) {
                element.classList.add('grab');
            }

            const position = {
                left: 0,
                top: 0,
                x: 0,
                y: 0,
            };

            function mouseDownHandler(e) {
                position.left = element.scrollLeft;
                position.top = element.scrollTop;
                position.x = e.clientX;
                position.y = e.clientY;

                element.addEventListener('mousemove', mouseMoveHandler);
                window.addEventListener('mouseup', mouseUpHandler);
                document.body.classList.add('unselectable');
                element.classList.add('grabbing');
            }

            function mouseMoveHandler(e) {
                const deltaX = e.clientX - position.x;
                element.scrollLeft = position.left - deltaX;
            }

            function mouseUpHandler() {
                element.removeEventListener('mousemove', mouseMoveHandler);
                window.removeEventListener('mouseup', mouseUpHandler);
                document.body.classList.remove('unselectable');
                element.classList.remove('grabbing');
            }

            element.addEventListener('mousedown', mouseDownHandler);

            return (() => {
                element.removeEventListener('mousedown', mouseDownHandler);
            });
        }, [refScrollBar]);
    }

    function onScrollHandler(e) {
        Scrolls[name].scrollX = e.target.scrollLeft;
        Scrolls[name].scrollY = e.target.scrollTop;
    }

    function resize() {
        if (!refScrollBar.current) return;

        const element = refScrollBar.current;

        if (calcHeight) {
            element.style.height = '0px';
            const parentElement = element.parentElement;
            const parentHeight = parentElement.offsetHeight;
            element.style.height = `${ parentHeight }px`;
        }

        Scrolls[name].isVertical = element.scrollHeight > element.clientHeight;
        Scrolls[name].isHorizontal = element.scrollWidth > element.clientWidth;
    }

    return (
        <>
            <div ref={ refScrollBar } className={ `scrollbar ${ revert ? 'scrollbar-revert' : '' } ${ colored ? 'scrollbar-colored' : '' } ${ calcHeight ? 'calc-height' : '' }` } onScroll={ onScrollHandler }>
                { props.children }
            </div>
        </>
    );
}

export default Scrollbar;
