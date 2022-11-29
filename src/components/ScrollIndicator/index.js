// React
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// Utils
import Scrolls from '@/utils/Scrolls';

// CSS
import './style.scoped.scss';

// Hooks
import useTick from '@/hooks/useTick';

function ScrollIndicator() {
    const elRef = useRef();
    const barRef = useRef();
    const scrollTriggerd = useRef(false);
    const timelines = useRef({
        show: null,
        hide: null,
        idle: null,
    });
    const { t } = useTranslation();

    useTick(() => {
        if (!scrollTriggerd.current && Scrolls['panel-entity'] && Scrolls['panel-entity'].scrollY > 5) {
            scrollTriggerd.current = true;
            hide();
        }
    });

    useEffect(() => {
        show();
        createBarAnimation();
        return () => {
            timelines.current.show.kill();
            timelines.current.hide.kill();
            timelines.current.idle.kill();
        };
    }, []);

    function show() {
        timelines.current.hide?.kill();
        timelines.current.show = gsap.to(elRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut', delay: 1.55 });
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = gsap.to(elRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' });
    }

    function createBarAnimation() {
        timelines.current.idle = new gsap.timeline({ repeat: -1 });
        timelines.current.idle.fromTo(barRef.current, { scaleY: 1 }, { duration: 0.8, scaleY: 0, transformOrigin: 'bottom center', ease: 'sine.inOut' });
        timelines.current.idle.fromTo(barRef.current, { scaleY: 0 }, { duration: 1, scaleY: 1, transformOrigin: 'top center', ease: 'sine.inOut' });
        timelines.current.idle.timeScale(0.8);
    }

    return (
        <div className="scroll-indicator" ref={ elRef }>
            <span className="label">{ t('Scroll down') }</span>
            <span className="bar" ref={ barRef }></span>
        </div>
    );
}

export default ScrollIndicator;
