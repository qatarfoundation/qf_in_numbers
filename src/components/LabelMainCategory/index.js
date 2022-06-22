// Vendor
import gsap, { Power0, Power2 } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
gsap.registerPlugin(SplitText);
import React, { useEffect, useRef, useState } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';
import ButtonExplore from '../ButtonExplore/index';

const LabelMainCategory = (props) => {
    const { index: categoryIndex, anchor } = props;

    const labelRef = useRef();

    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        const handler = (position) => {
            labelRef.current.style.transform = `translate(${ position.x }px, ${ position.y }px)`;
        };

        TreeDataModel.addEventListener(`category/${ props.index }/label/position`, handler);

        return () => {
            TreeDataModel.removeEventListener(`category/${ props.index }/label/position`, handler);
        };
    }, [labelRef]);

    useEffect(() => {
        const mouseEnterHandler = ({ index }) => {
            if (categoryIndex !== index) {
                setIsHover(false);
                gsap.to(labelRef.current, { duration: 0.5, alpha: 0.15 });
            }
        };

        const mouseLeaveHandler = () => {
            setIsHover(true);
            gsap.to(labelRef.current, { duration: 0.5, alpha: 1 });
        };

        TreeDataModel.addEventListener('branch/mouseEnter', mouseEnterHandler);
        TreeDataModel.addEventListener('branch/mouseLeave', mouseLeaveHandler);

        return () => {
            TreeDataModel.removeEventListener('branch/mouseEnter', mouseEnterHandler);
            TreeDataModel.removeEventListener('branch/mouseLeave', mouseLeaveHandler);
        };
    });

    /**
     * References
     */
    const titleRef = useRef();
    const buttonRef = useRef();

    /**
     * Effects
     */
    useEffect(() => {
        const timeline = new gsap.timeline();
        const titleSplitText = new SplitText(titleRef.current, { type: 'lines,chars', linesClass: 'line', charsClass: 'char' });
        const lines = titleSplitText.lines;
        timeline.to(titleRef.current, 0, { opacity: 1 });
        timeline.to(buttonRef.current, 1, { opacity: 1, stagger: 0.05, ease: 'ease.easeOut' }, 1);
        timeline.add('charsLineIn');
        lines.forEach((line, i) => {
            timeline.to(line.querySelectorAll('.char'), 0.35, { opacity: 1, y: 0, stagger: 0.05, ease: 'ease.easeInOut' }, 'charsLineIn');
        });
    }, []);

    return (
        <div className={ `label ${ props.anchor } ${ isHover ? 'is-hover' : '' }` } ref={ labelRef }>
            <p ref={ titleRef } className="copy h4">
                { props.label }
            </p>
            <div ref={ buttonRef } className="container-button">
                <ButtonExplore name='Click to discover' direction={ anchor == 'right' ? 'left' : 'right' } />
            </div>
        </div>
    );
};

export default LabelMainCategory;
