// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

// Components
import ButtonHome from '@/components/ButtonHome';
import LangSwitch from '@/components/LangSwitch';
import ButtonSound from '@/components/ButtonSound';
import MainBreadcrumbs from '@/components/MainBreadcrumbs';

function TheNavigation(props) {
    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Stores
     */
    const modalSubcategoriesIsOpen = useStore((s) => s.modalSubcategoriesIsOpen);

    /**
     * Effects
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut();
    }, [isPresent]);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="the-navigation" ref={ el }>

            <div className="row">

                <div className="col-left">
                    <ButtonHome />
                    <MainBreadcrumbs pageContext={ props.pageContext } />
                </div>

                <div className="col-right">
                    { /* <ButtonSound className="button-sound" /> */ }
                    <LangSwitch />
                </div>
            </div>

        </div>
    );
}

export default TheNavigation;
