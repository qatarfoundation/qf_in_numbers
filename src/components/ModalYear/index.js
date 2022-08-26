// React
import React, { useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// Utils
import Globals from '@/utils/Globals';

// CSS
import './style.scoped.scss';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useStore from '@/hooks/useStore';

// Components
import ButtonModal from '@/components/ButtonModal';
import PanelYear from '@/components/PanelYear';

function ModalYear(props, ref) {
    /**
     * Data
     */
    const { language } = useI18next();
    const years = props.pageContext.years ? props.pageContext.years[language] : [];
    const currentYear = props.pageContext.year ? props.pageContext.year[language] : null;
    const allowedPagesType = ['year', 'category', 'subcategory'];

    /**
     * States
     */
    const [isVisible, setVisible] = useState(false);

    /**
     * Refs
     */
    const elRef = useRef();
    const panelRef = useRef();
    const overlayRef = useRef();
    const buttonContainerRef = useRef();
    const buttonRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
        open: null,
        close: null,
    });

    /**
     * Store
     */
    const isModalYearOpen = useStore((state) => state.isModalYearOpen);

    /**
     * Watchers
     */
    useEffect(() => {
        if (allowedPagesType.includes(props.pageContext.type)) setVisible(true);
        else setVisible(false);
    }, [props.pageContext.type]);

    useEffect(() => {
        if (isVisible) show();
        else hide();
    }, [isVisible]);

    useEffect(() => {
        useStore.setState({ isModalYearOpen: false });
    }, [currentYear]);

    useEffect(() => {
        if (isModalYearOpen) open();
        else close();
    }, [isModalYearOpen]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        setupEventListeners();
    }

    function destroy() {
        removeEventListeners();

        timelines.current.open?.kill();
        timelines.current.close?.kill();
    }

    /**
     * Private
     */
    function show() {
        if (!elRef.current) return;

        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.add(buttonRef.current.show(), 0);
    }

    function hide() {
        if (!elRef.current) return;

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.add(buttonRef.current.hide(), 0);
    }

    function open() {
        if (!elRef.current) return;

        Globals.webglApp?.disableInteractions();

        timelines.current.close?.kill();
        timelines.current.open = new gsap.timeline();
        timelines.current.open.set(elRef.current, { zIndex: 1 }, 0);
        timelines.current.open.add(panelRef.current.show(), 0);
        timelines.current.open.to(overlayRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' }, 0);
    }

    function close() {
        if (!elRef.current) return;

        Globals.webglApp?.enableInteractions();

        timelines.current.open?.kill();
        timelines.current.close = new gsap.timeline();
        timelines.current.close.add(panelRef.current.hide(), 0);
        timelines.current.close.to(overlayRef.current, { duration: 0.5, autoAlpha: 0, ease: 'sine.inOut' }, 0);
        timelines.current.close.set(elRef.current, { zIndex: 'auto' });
    }

    /**
     * Events
     */
    function setupEventListeners() {
        window.addEventListener('keydown', keydownHandler);
        elRef.current?.addEventListener('wheel', wheelHandler);
    }

    function removeEventListeners() {
        window.removeEventListener('keydown', keydownHandler);
        elRef.current?.removeEventListener('wheel', wheelHandler);
    }

    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function keydownHandler(e) {
        if (e.key !== 'Escape') return;

        useStore.setState({ isModalYearOpen: false });
    }

    function buttonModalClickHandler() {
        useStore.setState({ isModalYearOpen: !isModalYearOpen });
    }

    function buttonCloseClickHandler() {
        useStore.setState({ isModalYearOpen: false });
    }

    function overlayClickHandler() {
        useStore.setState({ isModalYearOpen: false });
    }

    function resizeHandler() {
        useStore.setState({ isModalYearOpen: false });
    }

    function wheelHandler(e) {
        e.stopPropagation();
    }

    return (
        <>
            {
                currentYear &&

                <div ref={ elRef } className={ `modal-year ${ isModalYearOpen ? 'is-open' : '' }` }>

                    <div ref={ overlayRef } onClick={ overlayClickHandler } className="overlay"></div>

                    <div ref={ buttonContainerRef } className="button-container">
                        <ButtonModal ref={ buttonRef } name={ currentYear.year } onClick={ buttonModalClickHandler } />
                    </div>

                    <div className="panel-container">
                        <PanelYear ref={ panelRef } isOpen={ isModalYearOpen } years={ years } currentYear={ currentYear } onClickClose={ buttonCloseClickHandler } />
                    </div>

                </div>
            }
        </>
    );
}

export default ModalYear;
