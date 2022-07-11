// React
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Components
import PanelSubcategories from '@/components/PanelSubcategories';
import ListIcon from '@/assets/icons/list.svg';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

function ModalSubcategories(props, ref) {
    /**
     * Data
     */
    const { language, originalPath } = useI18next();
    const year = props.pageContext.year ? props.pageContext.year[language] : null;
    const category = props.pageContext.category ? props.pageContext.category[language] : null;
    const subcategory = props.pageContext.subcategory ? props.pageContext.subcategory[language] : null;
    console.log(subcategory);
    const allowedPagesType = ['category', 'subcategory'];

    /**
     * States
     */
    const [isOpen, setOpen] = useState(false);
    const [isVisible, setVisible] = useState(false);

    /**
     * Refs
     */
    const elRef = useRef();
    const overlayRef = useRef();
    const panelRef = useRef();
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
        if (allowedPagesType.includes(props.pageContext.type)) setVisible(true);
        else setVisible(false);
    }, [props.pageContext.type]);

    useEffect(() => {
        setOpen(false);
    }, [originalPath]);

    useEffect(() => {
        if (isVisible) show();
        else hide();
    }, [isVisible]);

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
        if (!elRef.current) return;

        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.to(buttonRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' }, 0);
    }

    function hide() {
        if (!elRef.current) return;

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(buttonRef.current, { duration: 0.5, autoAlpha: 0, ease: 'sine.inOut' }, 0);
    }

    function open() {
        if (!elRef.current) return;

        // set zIndex on top of everything on open to prevent click on other overlays
        elRef.current.style.zIndex = 1;

        timelines.current.close?.kill();
        timelines.current.open = new gsap.timeline();
        timelines.current.open.add(panelRef.current.show(), 0);
        timelines.current.open.to(overlayRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' }, 0);
    }

    function close() {
        if (!elRef.current) return;

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
                (category || subcategory) &&

                <div ref={ elRef } className={ `modal-subcategories ${ isOpen ? 'is-open' : '' }` }>

                    <button ref={ buttonRef } className="button button-open" onClick={ buttonModalClickHandler }>
                        <ListIcon />
                        <div className="button-circle"></div>
                    </button>

                    <div ref={ overlayRef } onClick={ overlayClickHandler } className="overlay"></div>

                    <div className="panel-container">
                        <PanelSubcategories ref={ panelRef } isOpen={ isOpen } year={ year } category={ category } subcategory={ subcategory } onClickClose={ buttonCloseClickHandler } />
                    </div>

                </div>
            }
        </>
    );
}

export default forwardRef(ModalSubcategories);
