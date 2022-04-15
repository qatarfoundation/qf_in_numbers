// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef, useState } from 'react';

// CSS
import './style.scoped.scss';

// Utils
// const WindowResizeObserver = React.lazy(() => import('@/utils/WindowResizeObserver'));

const DPR = 2;

const ButtonSound = (props) => {
    /**
     * Refs
     */
    const data = useRef({
        bounds: null,
        width: 0,
        height: 0,
        ctx: null,
        time: 0,
        points: [],
    });

    const settings = useRef({
        speed: 0.15,
        frequency: 0.3,
        amplitude: 0.2,
        amplitudeScale: 1,
    });

    const timelines = useRef({
        mute: null,
        unmute: null,
        mouseenter: null,
        mouseleave: null,
    });

    const el = useRef();
    const canvas = useRef();

    /**
     * States
     */
    const [isMuted, setMuted] = useState(false);
    const [isHovered, setHovered] = useState(false);

    /**
     * Effets
     */
    useEffect(() => {
        if (isMuted) mute();
        else unmute();
    }, [isMuted]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        data.current.ctx = canvas.current.getContext('2d');

        createPoints();
        resize();
        setupEventListeners();
    }

    function destroy() {
        removeEventListener();
    }

    /**
     * Private
     */
    function mute() {
        timelines.current.mute?.kill();
        timelines.current.unmute?.kill();
        timelines.current.mouseenter?.kill();
        timelines.current.mouseleave?.kill();

        timelines.current.mute = new gsap.timeline();

        timelines.current.mute.to(settings.current, { duration: 1, amplitude: 0.05, ease: 'power4.out' }, 0);
        timelines.current.mute.to(settings.current, { duration: 1, speed: 0.08, ease: 'sine.out' }, 0);

        return timelines.current.mute;
    }

    function unmute() {
        timelines.current.mute?.kill();
        timelines.current.unmute?.kill();
        timelines.current.mouseenter?.kill();
        timelines.current.mouseleave?.kill();

        timelines.current.unmute = new gsap.timeline();

        timelines.current.unmute.to(settings.current, { duration: 1, amplitude: 0.2, ease: 'power4.out' }, 0);
        timelines.current.unmute.to(settings.current, { duration: 1, speed: 0.15, ease: 'sine.out' }, 0);

        return timelines.current.unmute;
    }

    function createPoints() {
        const amount = 100;

        for (let i = 0; i < amount; i++) {
            const point = { x: 0, y: 0 };
            data.current.points.push(point);
        }
    }

    function resize() {
        data.current.bounds = el.current.getBoundingClientRect();
        data.current.width = data.current.bounds.width;
        data.current.height = data.current.bounds.height;

        canvas.current.width = data.current.width * DPR;
        canvas.current.height = data.current.height * DPR;

        data.current.ctx.scale(DPR, DPR);
    }

    function update() {
        updatePoints();

        data.current.time += settings.current.speed;
    }

    function updatePoints() {
        const amplitude = settings.current.amplitude * settings.current.amplitudeScale;

        for (let i = 0; i < data.current.points.length; i++) {
            const element = data.current.points[i];
            const x = data.current.width / data.current.points.length * i;
            element.x = data.current.width / data.current.points.length * i;
            element.y = data.current.height / 2 + Math.sin((x + data.current.time) * settings.current.frequency) * (data.current.height * amplitude);
        }
    }

    function draw() {
        data.current.ctx.clearRect(0, 0, data.current.width, data.current.height);

        drawLine();
    }

    function drawLine() {
        data.current.ctx.strokeStyle = 'white';
        data.current.ctx.lineWidth = 1.5;

        data.current.ctx.beginPath();

        data.current.ctx.moveTo(data.current.points[0].x, data.current.points[0].y);

        for (let i = 1; i < data.current.points.length; i++) {
            const point = data.current.points[i];
            data.current.ctx.lineTo(point.x, point.y);
        }

        data.current.ctx.stroke();

        data.current.ctx.closePath();
    }

    /**
     * Handlers
     */
    function setupEventListeners() {
        // WindowResizeObserver.addEventListener('resize', resizeHandler);
        gsap.ticker.add(tickHandler);
    }

    function removeEventListener() {
        // WindowResizeObserver.removeEventListener('resize', resizeHandler);
        gsap.ticker.remove(tickHandler);
    }

    function resizeHandler() {
        resize();
    }

    function tickHandler() {
        draw();
        update();
    }

    function mouseenterHandler() {
        timelines.current.mouseleave?.kill();

        timelines.current.mouseenter = new gsap.timeline();

        // if (isMuted) {
        //     timelines.current.mouseenter.to(settings.current, { duration: 0.5, amplitudeScale: 1.8, ease: 'sine.out' }, 0);
        // } else {
        //     timelines.current.mouseenter.to(settings.current, { duration: 0.5, amplitudeScale: 0.5, ease: 'sine.out' }, 0);
        // }

        return timelines.current.mouseenter;
    }

    function mouseleaveHandler() {
        timelines.current.mouseenter?.kill();

        timelines.current.mouseleave = new gsap.timeline();

        // timelines.current.mouseleave.to(settings.current, { duration: 0.5, amplitudeScale: 1, ease: 'sine.out' }, 0);

        return timelines.current.mouseleave;
    }

    function clickHandler() {
        setMuted(!isMuted);
    }

    return (
        <button className="button button-sound" ref={ el } onClick={ clickHandler } onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler }>
            <canvas className="canvas" ref={ canvas }></canvas>
        </button>
    );
};

export default ButtonSound;
