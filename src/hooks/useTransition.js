// WIP

// React
import { useEffect, useState } from 'react';
import { usePresence } from 'framer-motion';

export const TRANSITION_IN = 'transition-in';
export const TRANSITION_OUT = 'transition-out';

export default function useTransition() {
    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();
    const [state, setState] = useState({
        transition: isPresent ? TRANSITION_IN : TRANSITION_OUT,
        callback: safeToRemove,
    });

    /**
     * Effects
     */
    useEffect(() => {
        setState({
            transition: isPresent ? TRANSITION_IN : TRANSITION_OUT,
            callback: safeToRemove,
        });
    }, [isPresent]);

    return state;
}