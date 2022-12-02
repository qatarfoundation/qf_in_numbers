// React
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { gsap } from 'gsap';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// CSS
import './style.scoped.scss';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Components
import ButtonClose from '@/components/ButtonClose';
import ListYears from '@/components/ListYears';
import Scrollbar from '@/components/ScrollBar';

function PanelYear(props, ref) {
    /**
     * Data
     */
    const { language } = useI18next();
    const { years, currentYear } = props;
    const { t } = useTranslation();

    const activeYears = years.filter(year => {
        return year.categories.filter(cat => cat.subcategories.length !== 0).length !== 0;
    });

    /**
     * Refs
     */
    const elRef = useRef();
    const contentRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
    });

    useEffect(() => {
        // Note: On locale switch kill all tweens and clear tween props
        // As the transform values are different between languages...
        reset();
    }, [language]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {

    }

    function destroy() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.set(elRef.current, { autoAlpha: 1 }, 0);
        timelines.current.show.to(elRef.current, { duration: 1.2, x: '0%', y: '0%', ease: 'power3.out' });
        timelines.current.show.to(contentRef.current, { duration: 1, opacity: 1, ease: 'sine.inOut' }, 0);
        timelines.current.show.fromTo(contentRef.current, { x: '15%' }, { duration: 1.3, x: '0%', ease: 'power3.out' }, 0);
        return timelines.current.show;
    }

    function hide() {
        const isTranslateY = Breakpoints.current === 'small';
        const translateX = !isTranslateY ? (language === 'ar-QA' ? '100%' : '-100%') : null;
        const translateY = isTranslateY ? '100%' : null;

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 1, x: translateX, y: translateY, ease: 'power3.inOut' });
        timelines.current.hide.set(elRef.current, { autoAlpha: 0 });
        timelines.current.hide.to(contentRef.current, { duration: 0.5, opacity: 0, ease: 'sine.inOut' }, 0);
        return timelines.current.hide;
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    /**
     * Private
     */
    function reset() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
        gsap.set(elRef.current, { clearProps: true });
    }

    return (
        <div ref={ elRef } className="panel panel-year" data-name="year">

            <div className="content" ref={ contentRef }>

                <div className="header">

                    <p className="label h8">{ t('Year selection') }</p>

                    <ButtonClose onClick={ props.onClickClose } />

                </div>

                <div className="years">

                    <Scrollbar revert={ false } name="panel-year">

                        <ListYears years={ activeYears } currentYear={ currentYear } />

                    </Scrollbar>

                </div>

            </div>

        </div>
    );
}

export default forwardRef(PanelYear);
