// Vendor
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';

const LabelMainCategory = (props) => {
    const { index: categoryIndex } = props;

    const labelRef = useRef();

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
                gsap.to(labelRef.current, { duration: 0.5, alpha: 0.15 });
            }
        };

        const mouseLeaveHandler = () => {
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
        <div className={ `label ${ props.anchor }` } ref={ labelRef }>
            <div className="copy">
                { props.label }
            </div>
        </div>
    );
};

export default LabelMainCategory;
