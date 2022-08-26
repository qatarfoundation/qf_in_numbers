// React
import React, { useRef } from 'react';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Components
import ListIcon from '@/assets/icons/list.svg';

// Hooks
import useStore from '@/hooks/useStore';

function ButtonFullList(props, ref) {
    const buttonRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
    });

    const isModalSubcategoriesOpen = useStore((state) => state.isModalSubcategoriesOpen);

    /**
     * Private
     */
    function show() {
        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.to(buttonRef.current, { duration: 0.5, autoAlpha: 1, ease: 'sine.inOut' }, 0);
    }

    function hide() {
        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(buttonRef.current, { duration: 0.5, autoAlpha: 0, ease: 'sine.inOut' }, 0);
    }

    /**
     * Handlers
     */
    function buttonModalClickHandler() {
        useStore.setState({ isModalSubcategoriesOpen: !isModalSubcategoriesOpen });
    }

    return (
        <button ref={ buttonRef } className="button button-open" onClick={ buttonModalClickHandler }>
            <ListIcon />
            <span className="button-open__label">Full list</span>
        </button>
    );
}

export default ButtonFullList;
