// React
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { gsap } from 'gsap';

// CSS
import './style.scoped.scss';

// Components
import ButtonMainCategory from '@/components/ButtonMainCategory';
import { useRef } from 'react';
import { forwardRef } from 'react';

function ListCategories(props, ref) {
    /**
     * Props
     */
    const { categories, year } = props;

    /**
     * States
     */
    const [hoveredItemId, setHoveredItemId] = useState(null);

    /**
     * Refs
     */
    const itemRefs = useRef({});

    const buttonCommunityRef = useRef();
    const buttonResearchRef = useRef();
    const buttonEducationRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
    });

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {

    }

    function destroy() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();

        timelines.current.show = new gsap.timeline();

        timelines.current.show.add(buttonCommunityRef.current.show(), 0);
        timelines.current.show.add(buttonResearchRef.current.show(), 0.1);
        timelines.current.show.add(buttonEducationRef.current.show(), 0.2);

        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();

        timelines.current.hide.add(buttonCommunityRef.current.hide(), 0);
        timelines.current.hide.add(buttonResearchRef.current.hide(), 0);
        timelines.current.hide.add(buttonEducationRef.current.hide(), 0);

        return timelines.current.hide;
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    /**
     * Handlers
     */
    function mouseenterHandler(e) {
        const id = e.currentTarget.dataset.id;
        setHoveredItemId(id);
    }

    function mouseleaveHandler() {
        setHoveredItemId(null);
    }

    return (
        <ul className="list-categories">

            { categories[0] &&
                <li className={ `list-item ${ hoveredItemId && hoveredItemId !== 'community'  ? 'is-not-active' : '' }` } data-id="community" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler } ref={ (item) => itemRefs.current.community = item }>
                    <ButtonMainCategory ref={ buttonCommunityRef } index={ 0 } slug={ `/${ year }/community` } categoryId="community" label={ categories[0].name } color="blue" anchorX="left" anchorY="top" />
                </li>
            }

            { categories[1] &&
                <li className={ `list-item ${ hoveredItemId && hoveredItemId !== 'research'  ? 'is-not-active' : '' }` } data-id="research" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler } ref={ (item) => itemRefs.current.research = item }>
                    <ButtonMainCategory ref={ buttonResearchRef } index={ 1 } slug={ `/${ year }/research` } categoryId="research" label={ categories[1].name } color="red" anchorX="left" anchorY="bottom" />
                </li>
            }

            { categories[2] &&
                <li className={ `list-item ${ hoveredItemId && hoveredItemId !== 'education'  ? 'is-not-active' : '' }` } data-id="education" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler } ref={ (item) => itemRefs.current.education = item }>
                    <ButtonMainCategory ref={ buttonEducationRef } index={ 2 } slug={ `/${ year }/education` } categoryId="education" label={ categories[2].name } color="green" anchorX="right" anchorY="top" />
                </li>
            }

        </ul>
    );
}

export default forwardRef(ListCategories);
