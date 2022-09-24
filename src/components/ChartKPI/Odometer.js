import React, { forwardRef, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import gsap from 'gsap';
import { useInView } from 'react-intersection-observer';

function MyOdometer({ duration = 1, ...props }, ref) {
    const localRef = useRef();
    const [viewRef, inView] = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;
        const t = localRef.current.innerText;
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
                    localRef.current.innerText = Math.round(o.n);
                },
                duration: _duration,
                delay: 0.5,
                ease: 'expo.out',
            },
        );
        return () => anim.kill();
    }, [inView]);
    return <span ref={ mergeRefs([localRef, viewRef, ref]) } { ...props } />;
}

export default forwardRef(MyOdometer);
