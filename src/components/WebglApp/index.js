// Vendor
import React, { useEffect, useRef } from 'react';

// CSS
import './style.scoped.scss';

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
        const app = new WebglApp({
            canvas: canvas.current,
            showDebug: environment === DEVELOPMENT,
        });

        if (props.preloaderState === COMPLETE) {
            app.start();
            app.showView(props.page);
        }

        return () => {
            app.destroy();
        };
    }, []);

    return(
        <canvas ref={ canvas } className="background"></canvas>
    );
}

export default WebglAppComponent;
