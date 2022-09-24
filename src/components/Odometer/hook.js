import { useEffect } from 'react';
import gsap from 'gsap';

export function useOdometer({ ref, animate, duration, selector }) {
    useEffect(() => {
        if (!animate) return;
        const _ref = selector ? ref.current.querySelector(selector) : ref.current;
        const t = _ref.innerHTML;
        const n = Number(t);
        if (!Number.isFinite(n)) return;
        const o = { n: 0 };
        const from = n > 1000 ? Number('1'.padEnd(t.length, 0)) : 0;
        const _duration = duration + t.length * 0.2;
        const anim = gsap.fromTo(
            o,
            { n: from },
            {
                n,
                onUpdate: () => {
                    _ref.innerHTML = Math.round(o.n);
                },
                duration: _duration,
                delay: 0.5,
                ease: 'expo.out',
            },
        );
        return () => anim.kill();
    }, [animate]);
}