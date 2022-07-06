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

// Components
import ButtonModal from '@/components/ButtonModal';
import PanelYear from '@/components/PanelYear';

function ModalYear(props, ref) {
    /**
     * Data
     */
    const { language } = useI18next();
    const years = props.pageContext.years[language];
    const currentYear = props.pageContext.year ? props.pageContext.year[language] : null;
    years.sort((a, b) => b.year - a.year);
    const allowedPagesType = ['year', 'category', 'subcategory'];

    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);

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
     * Watchers
     */
    useEffect(() => {
        if (allowedPagesType.includes(props.pageContext.type)) show();
        else hide();
    }, [props.pageContext.type]);

    useEffect(() => {
        setOpen(false);
    }, [currentYear]);

    useEffect(() => {
        if (isOpen) open();
        else close();
    }, [isOpen]);

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
        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.add(buttonRef.current.show(), 0);
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.add(buttonRef.current.hide(), 0);
    }

    function open() {
        if (!elRef.current) return;

        Globals.webglApp?.disableInteractions();

        // set zIndex on top of everything on open to prevent click on other overlays
        elRef.current.style.zIndex = 1;

        timelines.current.close?.kill();
        timelines.current.open = new gsap.timeline();
        timelines.current.open.add(panelRef.current.show(), 0);
    }

    function close() {
        if (!elRef.current) return;

        Globals.webglApp?.enableInteractions();

        // reset zIndex
        elRef.current.style.zIndex = 'auto';

        timelines.current.open?.kill();
        timelines.current.close = new gsap.timeline();
        timelines.current.close.add(panelRef.current.hide(), 0);
    }

    /**
     * Events
     */
    function setupEventListeners() {
        window.addEventListener('keydown', keydownHandler);
    }

    function removeEventListeners() {
        window.removeEventListener('keydown', keydownHandler);
    }

    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function keydownHandler(e) {
        if (e.key !== 'Escape') return;

        setOpen(false);
    }

    function buttonModalClickHandler() {
        setOpen(!isOpen);
    }

    function buttonCloseClickHandler() {
        setOpen(false);
    }

    function overlayClickHandler() {
        setOpen(false);
    }

    function resizeHandler() {
        setOpen(false);
    }

    return (
        <>
            {
                currentYear &&

                <div ref={ elRef } className={ `modal-year ${ isOpen ? 'is-open' : '' }` }>

                    <div ref={ overlayRef } onClick={ overlayClickHandler } className="overlay"></div>

                    <div ref={ buttonContainerRef } className="button-container">
                        <ButtonModal ref={ buttonRef } name={ currentYear.year } onClick={ buttonModalClickHandler } />
                    </div>

                    <div className="panel-container">
                        <PanelYear ref={ panelRef } isOpen={ isOpen } years={ years } currentYear={ currentYear } onClickClose={ buttonCloseClickHandler } />
                    </div>

                </div>
            }
        </>
    );
}

export default ModalYear;
