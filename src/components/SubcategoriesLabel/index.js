// Vendor
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import Breakpoints from '@/utils/Breakpoints';
import Globals from '@/utils/Globals';
import BranchHover from '@/utils/BranchHover';

const LabelMainCategory = (props) => {
    const { index: categoryIndex, categoryId, subcategories } = props;

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
        const midLength = Math.round(length / 2);
        const radius = (Breakpoints.active('small') ? 60 : 80);

        const angleMargin = Math.PI * .1;
        const angleStep = (Math.PI - angleMargin * 2) / 5;
        let angleStart = - Math.PI * .5;
        angleStart += (Math.PI - angleMargin * 2 - (angleStep * (midLength - 1))) * .5;
        elements.forEach((element, index) => {
            let angle = angleStart + angleMargin + (index % midLength) * angleStep;
            if (index >= midLength) angle += Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * 1.5 * Math.sin(angle);
            element.style.transform = `translate(${ x }px, ${ y }px)`;
            element.classList.toggle('left', angle >= Math.PI * 0.5);
        });
    }, [itemsRef]);

    // useEffect(() => {
    //     TreeDataModel.addEventListener('branch/mouseEnter', mouseEnterHandler);
    //     TreeDataModel.addEventListener('branch/mouseLeave', mouseLeaveHandler);

    //     return () => {
    //         TreeDataModel.removeEventListener('branch/mouseEnter', mouseEnterHandler);
    //         TreeDataModel.removeEventListener('branch/mouseLeave', mouseLeaveHandler);
    //     };
    // }, []);

    useEffect(() => {
        BranchHover[categoryId].addEventListener('mouseEnter', mouseEnterHandler);
        BranchHover[categoryId].addEventListener('mouseLeave', mouseLeaveHandler);

        return () => {
            BranchHover[categoryId].removeEventListener('mouseEnter', mouseEnterHandler);
            BranchHover[categoryId].removeEventListener('mouseLeave', mouseLeaveHandler);
        };
    }, []);

    const mouseEnterHandler = (id) => {
        if (categoryId === id) {
            gsap.to(listRef.current, { duration: 0.5, autoAlpha: 1 });
        }
    };

    const mouseLeaveHandler = (id) => {
        if (categoryId === id) {
            gsap.to(listRef.current, { duration: 0.5, autoAlpha: 0 });
        }
    };

    function onMouseEnterHandler() {
        BranchHover[categoryId].mouseEnter(categoryId);
    }

    function onMouseLeaveHandler() {
        BranchHover[categoryId].mouseLeave(categoryId);
    }

    return (
        <ul className={ `list ${ categories[categoryIndex] }` } ref={ listRef }>
            {
                subcategories.map((subcategory, index) => {
                    return (
                        <li key={ index } ref={ el => itemsRef.current[index] = el }>
                            <Link to={ subcategory.slug } onMouseEnter={ onMouseEnterHandler } onMouseLeave={ onMouseLeaveHandler }>
                                <span>{ subcategory.name }</span>
                            </Link>
                        </li>
                    );
                })
            }
        </ul>
    );
};

export default LabelMainCategory;
