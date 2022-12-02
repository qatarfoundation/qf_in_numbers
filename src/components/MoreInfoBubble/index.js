// React
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function MoreInfoBubble(props) {
    const mount = document.getElementById('more-info-bubble');
    const el = document.createElement('div');

    useEffect(() => {
        if (!mount) return;
        mount.appendChild(el);
        return () => mount.removeChild(el);
    }, [el, mount]);

    return createPortal(props.children, el);
}

export default MoreInfoBubble;
