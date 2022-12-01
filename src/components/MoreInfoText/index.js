// React
import React, { useRef } from 'react';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

function MoreInfoText(props) {
    const refTooltip = useRef();

    function mouseEnterHandler() {
        gsap.to(refTooltip.current, { duration: 0.2, autoAlpha: 1, ease: 'sine.inOut' });
    }

    function mouseLeaveHandler() {
        gsap.to(refTooltip.current, { duration: 0.2, autoAlpha: 0, ease: 'sine.inOut' });
    }

    return (
        <div className="more-info-icon">
            <button className="button icon" onMouseEnter={ mouseEnterHandler } onMouseLeave={ mouseLeaveHandler }>
                +info
            </button>
            <div className="tooltip" ref={ refTooltip }>
                { props.value }
            </div>
        </div>
    );
}

export default MoreInfoText;
