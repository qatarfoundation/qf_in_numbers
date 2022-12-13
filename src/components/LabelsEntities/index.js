// React
import { gsap } from 'gsap';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// Utils
import Anchors from '@/webgl/utils/Anchors';

// Hooks
import useTick from '@/hooks/useTick';

// CSS
import './style.scoped.scss';

// Constants
const LIMIT = 4;

function LabelsEntities(props, ref) {
    const { entities } = props;
    const liRefs = useRef({});
    const elementRef = useRef();
    const selectedEntities = useRef(entities.slice(0, LIMIT));

    useTick(function() {
        selectedEntities.current.forEach(entity => {
            const id = entity.uuid;
            const anchor = Anchors.get(id);
            const element = liRefs.current[id];
            const screenPosition = anchor.screenPosition;
            element.style.transform = `translate3d(${ screenPosition.x }px, ${ screenPosition.y }px, 0)`;
        });
    });

    function getSide(id) {
        const anchor = Anchors.get(id);
        const side = anchor.side > 0 ? 'right' : 'left';
        return side;
    }

    function show() {
        gsap.to(elementRef.current, { duration: 1, opacity: 1, ease: 'sine.inOut' });
    }

    function hide() {
        gsap.to(elementRef.current, { duration: 1, opacity: 0, ease: 'sine.inOut' });
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    return (
        <ul ref={ elementRef }>
            {
                selectedEntities.current && selectedEntities.current.map((entity, index) => {
                    return (
                        <li key={ index } ref={ el => liRefs.current[entity.uuid] = el } className={ getSide(entity.uuid) }>
                            <Link className="button" to={ entity.slug }>
                                <div className="icon"></div>
                                <div className="content">
                                    <div className="category">
                                        <span>{ entity.name }</span>
                                    </div>
                                    { entity.highlightedChart &&
                                        <div className="highlight">
                                            <span className="highlight__value">{ entity.highlightedChart.value }</span>
                                            <span className="highlight__title">{ entity.highlightedChart.title }</span>
                                        </div>
                                    }
                                </div>
                            </Link>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default forwardRef(LabelsEntities);
