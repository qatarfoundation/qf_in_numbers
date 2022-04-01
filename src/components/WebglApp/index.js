// Vendor
import React, { useEffect, useRef } from 'react';

// CSS
import * as styles from './style.module.scss';

// Webgl
import WebglApp from '@/webgl';

// Contexts
import { DEVELOPMENT, useEnvironment } from '@/contexts/EnvironmentContext';

// Hooks
import { COMPLETE } from '@/layouts/index/preloader';

const WebglAppComponent = (props) => {
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
    });

    return(
        <canvas ref={ canvas } className={ styles.background }></canvas>
    );
};

export default WebglAppComponent;
