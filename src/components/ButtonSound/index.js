// React
import React, { useEffect, useRef, useState } from 'react';

// CSS
import './style.scoped.scss';

// Utils
import SoundManager from '@/utils/SoundManager';

// Icons
import IconSound from '@/assets/icons/sound.svg';
import IconSoundMuted from '@/assets/icons/sound-muted.svg';

function ButtonSound() {
    /**
     * Refs
     */
    const el = useRef();

    /**
     * States
     */
    const [isMuted, setMuted] = useState(!SoundManager.initialized);

    /**
     * Effets
     */
    useEffect(() => {
        if (isMuted) mute();
        else unmute();
    }, [isMuted]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
    }, []);

    function mounted() {
    }

    /**
     * Private
     */
    function mute() {
        SoundManager.pause();
    }

    function unmute() {
        SoundManager.play();
    }

    /**
     * Handlers
     */
    function clickHandler() {
        setMuted(!isMuted);
    }

    return (
        <button className="button button-sound" ref={ el } onClick={ clickHandler }>
            { isMuted
                ? <IconSoundMuted />
                : <IconSound />
            }
        </button>
    );
}

export default ButtonSound;
