// React
import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useTranslation, Link } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useTick from '@/hooks/useTick';
import useStore from '@/hooks/useStore';

function ButtonDiscover(props, ref) {
    /**
     * Props
     */
    const { slug } = props;

    /**
     * Hooks
     */
    const { t } = useTranslation();

    /**
     * Store
     */
    const themeColors = useStore((state) => state.themeColors);

    /**
     * Refs
     */
    const buttonRef = useRef();
    const canvasRef = useRef();
    const buttonIconRef = useRef();
    const data = useRef({
        width: 0,
        height: 0,
        context: null,
        rotation: 0,
        hoverProgess: 0,
        hoverRotation: 0,
        themeColor: themeColors.secondary,
        timelineMouseEnter: null,
        timelineMouseLeave: null,
    });

    useImperativeHandle(ref, () => ({
        element: buttonRef.current,
    }));

    /**
     * Hooks
     */
    useWindowResizeObserver(resizeHandler);
    useTick(tickHandler);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
    }, []);

    function mounted() {
        data.current.context = canvasRef.current.getContext('2d');
        resize();
    }

    /**
     * Private
     */
    function update() {
        data.current.rotation += 0.01;
    }

    function draw() {
        if (!canvasRef.current) return;

        const context = data.current.context;
        const width = canvasRef.current.offsetWidth;
        const height = canvasRef.current.offsetHeight;
        const radius = width * 0.4 + data.current.hoverProgess * 3;
        const maskRadius = width * 0.9;
        const dotRadius = width * 0.04;

        context.clearRect(0, 0, width, height);

        context.save();
        context.translate(width * 0.5, height * 0.5);
        context.rotate(data.current.hoverRotation);

        // Mask
        const maskRotationRadius = radius * 0.9 + data.current.hoverProgess * radius * 2;
        const x = maskRotationRadius * Math.cos(data.current.rotation);
        const y = maskRotationRadius * Math.sin(data.current.rotation);
        const gradient = context.createRadialGradient(x, y, maskRadius * 0.4, x, y, maskRadius);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        // context.globalAlpha = 1.0 - data.current.hoverProgess;
        context.beginPath();
        context.arc(x, y, maskRadius, 0, 2 * Math.PI);
        context.closePath();
        context.fillStyle = gradient;
        context.fill();
        context.globalAlpha = 1;

        context.globalCompositeOperation = 'source-out';

        // Outline
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.closePath();
        context.strokeStyle = data.current.themeColor;
        context.stroke();

        context.globalCompositeOperation = 'source-over';

        // Center dot
        context.beginPath();
        context.arc(0, 0, dotRadius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = data.current.themeColor;
        context.fill();

        context.restore();
    }

    function resize() {
        const width = canvasRef.current.offsetWidth;
        const height = canvasRef.current.offsetHeight;
        data.current.width = width;
        data.current.height = height;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
    }

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    function tickHandler() {
        draw();
        update();
    }

    function mouseEnterHandler() {
        data.current.timelineMouseLeave?.kill();
        data.current.timelineMouseEnter = new gsap.timeline();
        data.current.timelineMouseEnter.to(data.current, { duration: 2, hoverProgess: 1, ease: 'power2.out' }, 0);
        data.current.timelineMouseEnter.to(data.current, { duration: 1, hoverRotation: `+=${ Math.PI * 1.2 }`, ease: 'power2.out' }, 0);
    }

    function onMouseLeaveHandler() {
        data.current.timelineMouseEnter?.kill();
        data.current.timelineMouseLeave = new gsap.timeline();
        data.current.timelineMouseLeave.to(data.current, { duration: 0.7, hoverProgess: 0, ease: 'power2.out' }, 0);
    }

    return (
        <Link to={ slug } className="button" ref={ buttonRef } onMouseEnter={ mouseEnterHandler } onMouseLeave={ onMouseLeaveHandler }>
            <div className="button__content">
                <div className="button__icon" ref={ buttonIconRef }>
                    <canvas ref={ canvasRef }></canvas>
                </div>
                <span className='button__label'>{ t('Click to discover') }</span>
            </div>
        </Link>
    );
}

export default forwardRef(ButtonDiscover);
