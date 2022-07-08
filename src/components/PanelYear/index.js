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

    /**
     * Refs
     */
    const elRef = useRef();

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
        timelines.current.show.to(elRef.current, { duration: 1, x: '0%', y: '0%', ease: 'power3.out' });
        return timelines.current.show;
    }

    function hide() {
        const isTranslateY = Breakpoints.current === 'small';
        const translateX = !isTranslateY ? (language === 'ar-QA' ? '105%' : '-105%') : null;
        const translateY = isTranslateY ? '105%' : null;

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 1, x: translateX, y: translateY, ease: 'power3.out' });
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

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    function resizeHandler(e) {

    }

    return (
        <div ref={ elRef } className="panel panel-year" data-name="year">

            <div className="header">

                <p className="label h8">{ t('Year selection') }</p>

                <ButtonClose onClick={ props.onClickClose } />

            </div>

            <Scrollbar revert={ false }>

                <ListYears years={ years } currentYear={ currentYear } />

            </Scrollbar>

        </div>
    );
}

export default forwardRef(PanelYear);
