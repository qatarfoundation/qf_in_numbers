// React
import React, {useState, useEffect, useRef} from 'react';

// CSS
import './style.scoped.scss';

// Assets
import ShareIcon from '@/assets/icons/share.svg';
import TwitterIcon from '@/assets/icons/twitter.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import MailIcon from '@/assets/icons/mail.svg';
import CopyIcon from '@/assets/icons/copy.svg';

import {gsap} from "gsap";

function ButtonShare(props, ref) {

    const [opened, setOpened] = useState(false);

    const wrapperRef = useRef();
    const listRef = useRef();

    const tlRef = useRef(null);

    useEffect(() => {
        if (tlRef.current) tlRef.current.kill()
        tlRef.current = gsap.timeline();
        if (opened) {
            tlRef.current.set(listRef.current, {display: "flex"}, 0)
            tlRef.current.to(listRef.current, {autoAlpha: 1, duration: 0.2}, 0);
        } else {
            tlRef.current.to(listRef.current, {autoAlpha: 0, duration: 0.2, display: 'none'}, 0);
        }
    }, [opened]);

    useEffect(() => {
        attach()
        return detach
    })

    function attach() {
        window.addEventListener('click', handleClickOutside);
    }

    function detach() {
        window.removeEventListener('click', handleClickOutside);
    }

    function handleClickOutside(e) {
        if (e.path.includes(wrapperRef.current)) return
        if (opened) setOpened(false)
    }

    function copyToClipboard() {
        let data = [new ClipboardItem({ "text/plain": new Blob([window.location.href], { type: "text/plain" }) })];
        navigator.clipboard.write(data).then(() => {
            setOpened(false)
        });
    }

    return (
        <div ref={wrapperRef} className="button-share-w">
            <button className="button-share" onClick={() => setOpened(!opened)}>
                <ShareIcon className="share-icon" />
            </button>

            <div ref={listRef} className="share-list">
                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" className="share-item">
                    <TwitterIcon className="share-icon icon-twitter" />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" className="share-item">
                    <LinkedinIcon className="share-icon icon-linkedin" />
                </a>
                <a href={`mailto:?body=${window.location.href}`} target="_blank" className="share-item">
                    <MailIcon className="share-icon" />
                </a>
                <button onClick={copyToClipboard} className="share-item">
                    <CopyIcon className="share-icon" />
                </button>
            </div>
        </div>
    );
}

export default ButtonShare;
