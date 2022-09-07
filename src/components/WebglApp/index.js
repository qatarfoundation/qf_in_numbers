// Vendor
import React, { useEffect, useRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Webgl
import WebglApp from '@/webgl';

// Contexts
import { DEVELOPMENT, useEnvironment } from '@/contexts/EnvironmentContext';

// Hooks
import { COMPLETE } from '@/hooks/usePreloader';

function WebglAppComponent(props) {
    const { onStateChange, preloaderState, containerRef } = props;

    const canvas = useRef(null);
    const environment = useEnvironment();

    const { language } = useI18next();

    useEffect(() => {
        Globals.webglApp = new WebglApp({
            canvas: canvas.current,
            showDebug: environment === DEVELOPMENT,
            mouseAreaElement: containerRef.current,
        });

        onStateChange('initialized');

        return () => {
            Globals.webglApp.destroy();
            onStateChange('destroyed');
        };
    }, [containerRef]);

    useEffect(() => {
        if (preloaderState === COMPLETE) {
            Globals.webglApp.start();
            onStateChange('started');
            Globals.webglApp.showView('home');
        }
    }, [preloaderState]);

    useEffect(() => {
        Globals?.webglApp?.dispatchEvent('language:change', language);
    }, [language]);

    return(
        <canvas ref={ canvas } className="background"></canvas>
    );
}

export default WebglAppComponent;
