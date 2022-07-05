// React
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';

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
import PanelSearch from '@/components/PanelSearch';

function ModalSearch(props, ref) {
    /**
     * Data
     */
    const { t } = useTranslation();
    const { language, originalPath } = useI18next();
    const years = props.pageContext.years[language];
    const currentYear = props.pageContext.year[language];
    years.sort((a, b) => b.year - a.year);

    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);

    /**
     * Refs
     */
    const panelRef = useRef();
    const elRef = useRef();
    const overlayRef = useRef();
    const buttonContainerRef = useRef();
    const timelines = useRef({
        open: null,
        close: null,
    });

    /**
     * Watchers
     */
    useEffect(() => {
        setOpen(false);
    }, [originalPath]);

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
    function open() {
        Globals.webglApp?.disableInteractions();

        // set zIndex on top of everything on open to prevent click on other overlays
        elRef.current.style.zIndex = 1;

        timelines.current.close?.kill();
        timelines.current.open = new gsap.timeline();
        timelines.current.open.add(panelRef.current.show(), 0);
    }

    function close() {
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
        <div ref={ elRef } className={ `modal-search ${ isOpen ? 'is-open' : '' }` }>

            <div ref={ overlayRef } onClick={ overlayClickHandler } className="overlay"></div>

            <div ref={ buttonContainerRef } className="button-container">

                <ButtonModal name={ t('Find data') } onClick={ buttonModalClickHandler } />

            </div>

            <div className="panel-container">

                <PanelSearch ref={ panelRef } isOpen={ isOpen } year={ currentYear } onClickClose={ buttonCloseClickHandler } />

            </div>

        </div>
    );
}

export default ModalSearch;
