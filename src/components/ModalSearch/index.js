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
import useStore from '@/hooks/useStore';

// Components
import ButtonModal from '@/components/ButtonModal';
import PanelSearch from '@/components/PanelSearch';

function ModalSearch(props, ref) {
    /**
     * Data
     */
    const { t } = useTranslation();
    const { language, originalPath } = useI18next();
    const years = props.pageContext.years ? props.pageContext.years[language] : [];
    const currentYear = props.pageContext.year ? props.pageContext.year[language] : null;
    years.sort((a, b) => b.year - a.year);
    const allowedPagesType = ['year', 'category', 'subcategory'];

    /**
     * States
     */
    const [isVisible, setVisible] = useState(false);

    /**
     * Refs
     */
    const panelRef = useRef();
    const elRef = useRef();
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
    const isModalSearchOpen = useStore((state) => state.isModalSearchOpen);

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
        useStore.setState({ isModalSearchOpen: false });
    }, [originalPath]);

    useEffect(() => {
        if (isModalSearchOpen) open();
        else close();
    }, [isModalSearchOpen]);

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
        timelines.current.show.set(buttonContainerRef.current, { clearProps: 'pointerEvents' }, 0);
    }

    function hide() {
        if (!elRef.current) return;

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.add(buttonRef.current.hide(), 0);
        timelines.current.hide.set(buttonContainerRef.current, { pointerEvents: 'none' }, 0);
    }

    function open() {
        if (!elRef.current) return;

        Globals.webglApp?.disableInteractions();

        // set zIndex on top of everything on open to prevent click on other overlays
        elRef.current.style.zIndex = 1;

        timelines.current.close?.kill();
        timelines.current.open = new gsap.timeline();
        timelines.current.open.add(panelRef.current.show(), 0);
        timelines.current.open.to(overlayRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' }, 0);
    }

    function close() {
        if (!elRef.current) return;

        Globals.webglApp?.enableInteractions();

        // reset zIndex
        elRef.current.style.zIndex = 'auto';

        timelines.current.open?.kill();
        timelines.current.close = new gsap.timeline();
        timelines.current.close.add(panelRef.current.hide(), 0);
        timelines.current.close.to(overlayRef.current, { duration: 0.5, autoAlpha: 0, ease: 'sine.inOut' }, 0);
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

        useStore.setState({ isModalSearchOpen: false });
    }

    function buttonModalClickHandler() {
        useStore.setState({ isModalSearchOpen: !isModalSearchOpen });
    }

    function buttonCloseClickHandler() {
        useStore.setState({ isModalSearchOpen: false });
    }

    function overlayClickHandler() {
        useStore.setState({ isModalSearchOpen: false });
    }

    function resizeHandler() {
        useStore.setState({ isModalSearchOpen: false });
    }

    function wheelHandler(e) {
        e.stopPropagation();
    }

    return (
        <>
            {
                currentYear &&

                <div ref={ elRef } className={ `modal-search ${ isModalSearchOpen ? 'is-open' : '' }` }>

                    <div ref={ overlayRef } onClick={ overlayClickHandler } className="overlay"></div>

                    <div ref={ buttonContainerRef } className="button-container">

                        <ButtonModal ref={ buttonRef } name={ t('Find data') } onClick={ buttonModalClickHandler } />

                    </div>

                    <div className="panel-container">

                        <PanelSearch ref={ panelRef } isOpen={ isModalSearchOpen } year={ currentYear } onClickClose={ buttonCloseClickHandler } />

                    </div>

                </div>
            }
        </>
    );
}

export default ModalSearch;
