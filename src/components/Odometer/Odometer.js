import React, { forwardRef, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import gsap from 'gsap';
import { useInView } from 'react-intersection-observer';
import { useOdometer } from './hook';

function MyOdometer({ duration = 1, ...props }, ref) {
    const localRef = useRef();
    const [viewRef, inView] = useInView({ triggerOnce: true });
    useOdometer({ ref: localRef, animate: inView, duration });

    return <span ref={ mergeRefs([localRef, viewRef, ref]) } { ...props } />;
}

export default forwardRef(MyOdometer);
