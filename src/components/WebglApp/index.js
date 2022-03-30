// Vendor
import React, { useEffect, useRef } from 'react';

// CSS
import * as styles from './style.module.scss';

// Webgl
import WebglApp from '@/webgl';

const WebglAppComponent = (props) => {
    const canvas = useRef(null);

    useEffect(() => {
        const app = new WebglApp({
            canvas: canvas.current,
        });
        app.start();
        app.showView(props.page);

        return () => {
            app.destroy();
        };
    });

    return(
        <canvas ref={ canvas } className={ styles.background }></canvas>
    );
};

export default WebglAppComponent;
