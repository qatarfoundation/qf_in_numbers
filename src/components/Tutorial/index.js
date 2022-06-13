// React
import React, { useEffect, useRef, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import gsap, { Power0, Power2 } from 'gsap';
// Components
import Drag from '@/assets/icons/drag.svg';
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
    const [isDrag, setIsDrag] = useState(true);
    const [isSelect, setIsSelect] = useState(false);
    const { navigate } = useI18next();
    /**
     * Effects
     */
    useEffect(() => {
        gsap.to(dragRef.current, 1, {
            opacity: 1,
        });
    }, []);
    /**
     * Private
     */
    function dragHandlerButtonDrag() {
        gsap.to(dragRef.current, 1, {
            opacity: 0,
            ease: Power0.easeIn,
            onComplete: () => {
                setIsDrag(false);
                setIsSelect(true);
                gsap.to(selectRef.current, 1, {
                    opacity: 1,
                    ease: Power0.easeOut,
                });
            },
        });
    }

    function clickHandlerButtonSelect() {
        gsap.to(tutorialRef.current, 1, {
            opacity: 0,
            ease: Power0.easeIn,
            onComplete: () => {
                navigate(getLastYear());
            },
        });
    }
    function getLastYear() {
        const years = props.years;
        years.sort((a, b) => b.node.year - a.node.year);
        return years[0].node.year;
    }
    return (
        <div ref={ tutorialRef } className="tutorial">
            <h2 className='h6'>Explore the Qatar Foundation in numbers.</h2>
            { isDrag &&
                <div ref={ dragRef } className='container-drag'>
                    <button className="button button-drag" draggable="true" onDragStart={ dragHandlerButtonDrag }>
                        <div className="icon icon-drag">
                            <Drag className='drag' />
                        </div>
                    </button>
                    <p className='p3'>Drag right / left to start experience</p>
                </div>
            }
            { isSelect &&
                <div ref={ selectRef } className='container-select'>
                    <button className="button button-select"  onClick={ clickHandlerButtonSelect }>
                        <div className="icon icon-select">
                            <Select className='select' />
                        </div>
                    </button>
                    <p className='p3'>Select a node to explore Numbers</p>
                </div>
            }
        </div>
    );
}

export default Tutorial;
