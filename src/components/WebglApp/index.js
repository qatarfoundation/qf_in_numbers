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

    useLayoutEffect(() =>{
        props.onStateChange('initialized');
    },  []);

    useEffect(() => {
        Globals.webglApp = new WebglApp({
            canvas: canvas.current,
            showDebug: environment === DEVELOPMENT,
        });

        Globals.webglApp = app;
        props.onStateChange('initialized');

        if (props.preloaderState === COMPLETE) {
            app.start();
            props.onStateChange('started');
            Globals.webglApp.showView('home');
        }

        return () => {
            app.destroy();
        };
    }, [props.preloaderState]);

    return(
        <canvas ref={ canvas } className="background"></canvas>
    );
}

export default WebglAppComponent;
