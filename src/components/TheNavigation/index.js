// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';

// CSS
import './style.scoped.scss';

// Components
import ButtonHome from '@/components/ButtonHome';
import LangSwitch from '@/components/LangSwitch';
import ButtonSound from '@/components/ButtonSound';

function TheNavigation(props) {
    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(el.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.set(el.current, { alpha: 0, onComplete: transitionOutCompleted });
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
                </div>

                <div className="col-right">
                    <ButtonSound className="button-sound" />
                    <LangSwitch />
                </div>
            </div>

        </div>
    );
}

export default TheNavigation;
