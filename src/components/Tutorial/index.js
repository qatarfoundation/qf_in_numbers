// React
import React, { useEffect, useRef } from 'react';
import gsap, { Power0, Power2 } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
gsap.registerPlugin(SplitText);
import { useI18next } from 'gatsby-plugin-react-i18next';

// Components
import Select from '@/assets/icons/select.svg';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function Tutorial(props) {
    /**
     * References
     */
    const tutorialRef = useRef();
    const titleRef = useRef();
    const dragRef = useRef();
    const selectRef = useRef();
    /**
     * States
     */
    const { navigate } = useI18next();
    /**
     * Effects
     */
    useEffect(() => {
        const timeline = new gsap.timeline({
            onComplete: () => {
                const timeline = new gsap.timeline({ repeat: -1 });
                timeline.to(dragRef.current, 1, { opacity: 1 });
                timeline.to(dragRef.current, 0.75, { opacity: 0, delay: 2 });
                timeline.to(selectRef.current, 1, { opacity: 1 });
                timeline.to(selectRef.current, 0.75, { opacity: 0, delay: 2 });
            },
        });
        const titleSplitText = new SplitText(titleRef.current, { type: 'lines,chars', linesClass: 'line', charsClass: 'char' });
        const lines = titleSplitText.lines;
        timeline.to(titleRef.current, 0, { opacity: 1 });
        timeline.add('charsLineIn');
        lines.forEach((line, i) => {
            timeline.to(line.querySelectorAll('.char'), 1, { opacity: 1, stagger: 0.015, ease: Power0.easeOut }, 'charsLineIn');
        });
        timeline.add('fadeIn');
        timeline.to(dragRef.current, { duration: 0.75, alpha: 1, ease: 'sine.inOut' }, 'fadeIn');

        let clicked = false;
        const clickTutorial = () => {
            if (clicked) return;
            clicked = true;
            const timeline = new gsap.timeline({
                onComplete: () => {
                    const years = props.years;
                    years.sort((a, b) => b.node.year - a.node.year);
                    useStore.setState({ isTutorial: false });
                    navigate('/' +  years[0].node.year);
                },
            });
            timeline.to(tutorialRef.current, 0.75, { opacity: 0 });
        };
        document.body.addEventListener('click', clickTutorial);
        return () => {
            timeline.kill();
            document.body.removeEventListener('click', clickTutorial);
        };
    }, []);
    return (
        <div ref={ tutorialRef } className="tutorial">
            <h2 ref={ titleRef } className='h6'>Explore the Qatar Foundation in numbers.</h2>
            <div className="container-icons">
                <div ref={ dragRef } className='container-drag'>
                    <div className="icon icon-drag">
                        <div className='drag' />
                    </div>
                    <p className='p3'>Drag right / left to start experience</p>
                </div>
                <div ref={ selectRef } className='container-select'>
                    <div className="icon icon-select">
                        <Select className='select' />
                    </div>
                    <p className='p3'>Select a node to explore Numbers</p>
                </div>
            </div>
        </div>
    );
}

export default Tutorial;
