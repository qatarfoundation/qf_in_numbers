// React
import React, { useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Components
import PanelMenu from '@/components/PanelMenu';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useStore from '@/hooks/useStore';

function ModalMenu(props) {
    /**
     * Data
     */
    const { language, originalPath } = useI18next();
    const year = props.pageContext.year ? props.pageContext.year[language] : null;
    const category = props.pageContext.category ? props.pageContext.category[language] : null;
    const subcategory = props.pageContext.subcategory ? props.pageContext.subcategory[language] : null;
    const allowedPagesType = ['category', 'subcategory'];

    /**
     * States
     */
    const [isVisible, setVisible] = useState(false);
    const isModalMenuOpen = useStore((state) => state.isModalMenuOpen);

    /**
     * Refs
     */
    const elRef = useRef();
    const panelRef = useRef();

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
        if (allowedPagesType.includes(props.pageContext.type)) setVisible(true);
        else setVisible(false);
    }, [props.pageContext.type]);

    useEffect(() => {
        useStore.setState({ isModalMenuOpen: false });
    }, [originalPath]);

    useEffect(() => {
        if (isVisible) show();
        else hide();
    }, [isVisible]);

    useEffect(() => {
        if (isModalMenuOpen) open();
        else close();
    }, [isModalMenuOpen]);

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
    }

    function hide() {
        if (!elRef.current) return;

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
    }

    function open() {
        if (!elRef.current) return;

        // set zIndex on top of everything on open to prevent click on other overlays
        elRef.current.style.zIndex = 1;

        timelines.current.close?.kill();
        timelines.current.open = new gsap.timeline();
        timelines.current.open.add(panelRef.current.show(), 0);
    }

    function close() {
        if (!elRef.current) return;

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

        useStore.setState({ isModalMenuOpen: false });
    }

    function buttonCloseClickHandler() {
        useStore.setState({ isModalMenuOpen: false });
    }

    function resizeHandler() {
        useStore.setState({ isModalMenuOpen: false });
    }

    function wheelHandler(e) {
        e.stopPropagation();
    }

    return (
        <div ref={ elRef } className={ `modal-menu ${ isModalMenuOpen ? 'is-open' : '' }` }>
            <div className="panel-container">
                <PanelMenu ref={ panelRef } isOpen={ isModalMenuOpen } year={ year } category={ category } subcategory={ subcategory } onClickClose={ buttonCloseClickHandler } />
            </div>
        </div>
    );
}

export default ModalMenu;
