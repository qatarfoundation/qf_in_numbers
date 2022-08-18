// Vendor
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

// CSS
import './style.scoped.scss';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

const LabelMainCategory = (props) => {
    const { index: categoryIndex, subcategories } = props;

    const listRef = useRef();
    const itemsRef = useRef([]);

    const categories = [
        'community',
        'research',
        'education',
    ];

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
        <ul className={ `list ${ categories[categoryIndex] }` } ref={ listRef }>
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
