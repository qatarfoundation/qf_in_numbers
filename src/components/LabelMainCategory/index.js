// Vendor
import { gsap } from 'gsap';
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

    return (
        <div className={ `label ${ props.anchor } ${ isHover ? 'is-hover' : '' }` } ref={ labelRef }>
            <div className="copy h4">
                { props.label }
            </div>
            <ButtonExplore name='Click to discover' direction={ anchor == 'right' ? 'left' : 'right' } />
        </div>
    );
};

export default LabelMainCategory;
