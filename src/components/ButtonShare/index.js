// React
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Assets
import ShareIcon from '@/assets/icons/share.svg';
import TwitterIcon from '@/assets/icons/twitter.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import MailIcon from '@/assets/icons/mail.svg';
import CopyIcon from '@/assets/icons/copy.svg';

import { gsap } from 'gsap';

function ButtonShare(props, ref) {
    const [opened, setOpened] = useState(false);

    const { t } = useTranslation();

    const wrapperRef = useRef();
    const listRef = useRef();
    const tlRef = useRef(null);
    const copyMessageRef = useRef();
    const copyMessageTimeline = useRef();

    useEffect(() => {
        if (tlRef.current) tlRef.current.kill();
        tlRef.current = gsap.timeline();
        if (opened) {
            tlRef.current.set(listRef.current, { display: 'flex' }, 0);
            tlRef.current.to(listRef.current, { autoAlpha: 1, duration: 0.2 }, 0);
            tlRef.current.set(copyMessageRef.current, { opacity: 0 }, 0);
        } else {
            tlRef.current.to(listRef.current, { autoAlpha: 0, duration: 0.2, display: 'none' }, 0);
        }
    }, [opened]);

    useEffect(() => {
        attach();
        return detach;
    });

    function attach() {
        window.addEventListener('click', handleClickOutside);
    }

    function detach() {
        window.removeEventListener('click', handleClickOutside);
        copyMessageTimeline.current?.kill();
    }

    function handleClickOutside(e) {
        if (e.path?.includes(wrapperRef.current)) return;
        if (opened) setOpened(false);
    }

    function copyToClipboard() {
        const data = [new ClipboardItem({ 'text/plain': new Blob([window.location.href], { type: 'text/plain' }) })];
        navigator.clipboard.write(data).then(() => showCopiedMessage());
    }

    function showCopiedMessage() {
        copyMessageTimeline.current = new gsap.timeline();
        copyMessageTimeline.current.to(copyMessageRef.current, { duration: 0.3, opacity: 1, ease: 'sine.inOut' }, 0);
        copyMessageTimeline.current.call(() => setOpened(false), null, 1.3);
    }

    return (
        <div ref={ wrapperRef } className="button-share-w">
            <button className="button-share" onClick={ () => setOpened(!opened) }>
                <ShareIcon className="share-icon icon-share" />
            </button>

            <ul ref={ listRef } className="share-list">
                <li>
                    <a href={ `https://twitter.com/intent/tweet?url=${ window.location.href }` } target="_blank" className="share-item" rel="noreferrer">
                        <TwitterIcon className="share-icon icon-twitter" />
                    </a>
                </li>
                <li>
                    <a href={ `https://www.linkedin.com/sharing/share-offsite/?url=${ window.location.href }` } target="_blank" className="share-item" rel="noreferrer">
                        <LinkedinIcon className="share-icon icon-linkedin" />
                    </a>
                </li>
                <li>
                    <a href={ `mailto:?body=${ window.location.href }` } target="_blank" className="share-item" rel="noreferrer">
                        <MailIcon className="share-icon icon-mail" />
                    </a>
                </li>
                <li>
                    <button onClick={ copyToClipboard } className="share-item">
                        <CopyIcon className="share-icon icon-copy" />
                    </button>
                    <div className="copy-message" ref={ copyMessageRef }>{ t('Link copied') }</div>
                </li>
            </ul>
        </div>
    );
}

export default ButtonShare;
