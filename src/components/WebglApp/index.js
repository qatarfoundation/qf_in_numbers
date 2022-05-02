// Vendor
import React, { useEffect, useLayoutEffect, useRef } from 'react';

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
    const canvas = useRef(null);
    const environment = useEnvironment();

    useEffect(() => {
        Globals.webglApp = new WebglApp({
            canvas: canvas.current,
            showDebug: environment === DEVELOPMENT,
        });

        props.onStateChange('initialized');

        return () => {
            Globals.webglApp.destroy();
            props.onStateChange('destroyed');
        };
    }, []);

    useEffect(() => {
        if (props.preloaderState === COMPLETE) {
            Globals.webglApp.start();
            props.onStateChange('started');
            Globals.webglApp.showView('home');
        }
    }, [props.preloaderState]);

    return(
        <canvas ref={ canvas } className="background"></canvas>
    );
}

export default WebglAppComponent;
