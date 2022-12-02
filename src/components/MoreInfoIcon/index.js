// React
import React, { useRef, useEffect } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// Utils
import device from '@/utils/device';

// CSS
import './style.scoped.scss';

// Hooks
import useTick from '@/hooks/useTick';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import MoreInfoBubble from '@/components/MoreInfoBubble';

function MoreInfoIcon(props) {
    const refTooltip = useRef();
    const refButton = useRef();
    const updatePosition = useRef(false);
    const mousePosition = useRef({ x: 0, y: 0 });
    const tooltipWidth = useRef(0);
    const { language } = useI18next();

    useEffect(() => {
        resize();
        window.addEventListener('mousemove', mouseMoveHandler);
        document.body.addEventListener('touchmove', touchMoveHandler);
        return () => {
            window.removeEventListener('mousemove', mouseMoveHandler);
            document.body.removeEventListener('touchmove', touchMoveHandler);
        };
    }, []);

    useTick(() => {
        if (updatePosition.current) {
            refTooltip.current.style.transform = `translate(${ mousePosition.current.x }px, ${ mousePosition.current.y }px)`;
        }
    });

    useWindowResizeObserver(resize);

    function resize() {
        if (language === 'ar-QA') {
            tooltipWidth.current = refTooltip.current.offsetWidth;
        }
    }

    function mouseMoveHandler(e) {
        mousePosition.current.x = e.clientX - tooltipWidth.current;
        mousePosition.current.y = e.clientY;
    }

    function touchMoveHandler() {
        if (updatePosition.current) hideTooltip();
    }

    function showTooltip() {
        updatePosition.current = true;
        gsap.to(refTooltip.current, { duration: 0.2, autoAlpha: 1, ease: 'sine.inOut' });
    }

    function hideTooltip() {
        if (device.isTouch()) updatePosition.current = false;
        gsap.to(refTooltip.current, {
            duration: 0.2, autoAlpha: 0, ease: 'sine.inOut', onComplete: () => {
                updatePosition.current = false;
            },
        });
    }

    function mouseEnterHandler() {
        showTooltip();
    }

    function mouseLeaveHandler() {
        hideTooltip();
    }

    return (
        <div className="more-info-icon">
            <button className="button icon" ref={ refButton } onMouseEnter={ mouseEnterHandler } onMouseLeave={ mouseLeaveHandler }>
                <span></span>
            </button>
            <MoreInfoBubble>
                <div className="tooltip" ref={ refTooltip }>
                    { props.value }
                </div>
            </MoreInfoBubble>
        </div>
    );
}

export default MoreInfoIcon;
