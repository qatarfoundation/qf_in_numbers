// React
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Components
import Select from '@/assets/icons/select.svg';

// CSS
import './style.scoped.scss';

function Tutorial(props) {
    /**
     * References
     */
    const tutorialRef = useRef();
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
        const timeline = new gsap.timeline({ repeat: -1 });
        timeline.to(dragRef.current, 1, { opacity: 1 });
        timeline.to(dragRef.current, 0.75, { opacity: 0, delay: 2 });
        timeline.to(selectRef.current, 1, { opacity: 1 });
        timeline.to(selectRef.current, 0.75, { opacity: 0, delay: 2 });
        const clickTutorial = () => {
            const years = props.years;
            years.sort((a, b) => b.node.year - a.node.year);
            navigate(years[0].node.year);
        };
        document.body.addEventListener('click', clickTutorial);
        return () => {
            timeline.kill();
            document.body.removeEventListener('click', clickTutorial);
        };
    }, []);
    return (
        <div ref={ tutorialRef } className="tutorial">
            <h2 className='h6'>Explore the Qatar Foundation in numbers.</h2>
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
