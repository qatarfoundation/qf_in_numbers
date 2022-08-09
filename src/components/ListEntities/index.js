// React
import React, { useState } from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonEntity from '@/components/ButtonEntity';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

// Utils
import Breakpoints from '@/utils/Breakpoints';

function ListEntities(props) {
    /**
     * Data
     */
    const { categorySlug, entities } = props;

    /**
     * States
     */
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    /**
     * Private
     */
    function resize() {
        setBreakpoints(Breakpoints.current);
    }

    return (
        <ul className="list-entities">

            {
                entities.map((entity, index) => {
                    const name = entity.name ? entity.name : 'Not translated'; // TMP
                    return (
                        <li className="list-item" key={ index }>
                            <ButtonEntity className="heading-list-subcategory" categorySlug={ categorySlug } entity={ entity }>
                                { breakpoints == 'small' ? index + 1 : name }
                            </ButtonEntity>
                        </li>
                    );
                })
            }

        </ul>
    );
}

export default ListEntities;
