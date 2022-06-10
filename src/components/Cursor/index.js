// React
import React, { useEffect, useState } from 'react';
// CSS
import './style.scoped.scss';
function Cursor(props) {
    /**
     * States
     */
    const [isHovering, setIsHovering] = useState(false);
    const [isGrabing, setIsGrabing] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    /**
     * Effects
     */
    useEffect(() => {
        const mouseMoveHandler = (event) => {
            const { clientX, clientY, target, path } = event;
            setMousePosition({ x: clientX, y: clientY });
            let is = false;
            path.forEach(item => {
                if (item.classList && item.classList.contains('scrollbar')) {
                    if (item.offsetWidth < item.firstChild.offsetWidth) {
                        is = true;
                    }
                }
            });
            setIsHovering(is);
        };
        const mouseDownHandler = (event) => {
            setIsGrabing(true);
        };
        const mouseUpHandler = (event) => {
            setIsGrabing(false);
        };
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mousedown', mouseDownHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
    }, []);
    useEffect(() => {
        document.body.style.cursor = isHovering ? isGrabing ? 'grabbing' : 'grab' : 'initial';
    }, [isHovering, isGrabing]);

    return (
        <div className={ `cursor ${ isHovering ? 'is-hovering' : '' } ${ isGrabing ? 'is-grabbing' : '' }` } style={ { left: mousePosition.x, top: mousePosition.y } }></div>
    );
}

export default Cursor;
