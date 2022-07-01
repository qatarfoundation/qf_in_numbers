// React
import React, { useEffect, useState } from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonMainCategory from '@/components/ButtonMainCategory';
import { useRef } from 'react';

function ListCategories(props) {
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
                    <ButtonMainCategory index={ 0 } slug={ `/${ year }/community` } categoryId="community" label={ categories[0].name } color="blue" anchorX="left" anchorY="top" />
                </li>
            }

            { categories[1] &&
                <li className={ `list-item ${ hoveredItemId && hoveredItemId !== 'research'  ? 'is-not-active' : '' }` } data-id="research" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler } ref={ (item) => itemRefs.current.research = item }>
                    <ButtonMainCategory index={ 1 } slug={ `/${ year }/research` } categoryId="research" label={ categories[1].name } color="red" anchorX="left" anchorY="bottom" />
                </li>
            }

            { categories[2] &&
                <li className={ `list-item ${ hoveredItemId && hoveredItemId !== 'education'  ? 'is-not-active' : '' }` } data-id="education" onMouseEnter={ mouseenterHandler } onMouseLeave={ mouseleaveHandler } ref={ (item) => itemRefs.current.education = item }>
                    <ButtonMainCategory index={ 2 } slug={ `/${ year }/education` } categoryId="education" label={ categories[2].name } color="green" anchorX="right" anchorY="top" />
                </li>
            }

        </ul>
    );
}

export default ListCategories;
