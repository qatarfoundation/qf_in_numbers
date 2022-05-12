// Vendor
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import Breakpoints from '@/utils/Breakpoints';

// CSS
import './style.scoped.scss';

// Hooks
import useTick from '@/hooks/useTick';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

const LabelMainCategory = (props) => {
    const { index: categoryIndex, subcategories } = props;

    const listRef = useRef();
    const itemsRef = useRef([]);

    useEffect(() => {
        const handler = (position) => {
            listRef.current.style.transform = `translate(${ position.x }px, ${ position.y }px)`;
        };

        TreeDataModel.addEventListener(`category/${ props.index }/categoryAnchor/position`, handler);

        return () => {
            TreeDataModel.removeEventListener(`category/${ props.index }/categoryAnchor/position`, handler);
        };
    }, [listRef]);

    useEffect(() => {
        const elements = itemsRef.current;
        const length = elements.length;
        const radius = 80;

        elements.forEach((element, index) => {
            const angle = index / length * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            element.style.transform = `translate(${ x }px, ${ y }px)`;
            if (angle > Math.PI * 0.95) element.classList.add('left');
        });
    }, [itemsRef]);

    useEffect(() => {
        const mouseEnterHandler = ({ index }) => {
            if (categoryIndex === index) {
                gsap.to(listRef.current, { duration: 0.5, alpha: 1 });
            }
        };

        const mouseLeaveHandler = ({ index }) => {
            if (categoryIndex === index) {
                gsap.to(listRef.current, { duration: 0.5, alpha: 0 });
            }
        };

        TreeDataModel.addEventListener('branch/mouseEnter', mouseEnterHandler);
        TreeDataModel.addEventListener('branch/mouseLeave', mouseLeaveHandler);

        return () => {
            TreeDataModel.removeEventListener('branch/mouseEnter', mouseEnterHandler);
            TreeDataModel.removeEventListener('branch/mouseLeave', mouseLeaveHandler);
        };
    });

    return (
        <ul className="list" ref={ listRef }>
            {
                subcategories.map((subcategory, index) => {
                    return (
                        <li key={ index } ref={ el => itemsRef.current[index] = el }>
                            <span>{ subcategory.name }</span>
                        </li>
                    );
                })
            }
        </ul>
    );
};

export default LabelMainCategory;
