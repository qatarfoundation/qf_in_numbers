// React
import { gsap } from 'gsap';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';

// Utils
import Anchors from '@/webgl/utils/Anchors';
import Globals from '@/utils/Globals';

// Hooks
import useTick from '@/hooks/useTick';
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

function LabelsSubcategories(props, ref) {
    const { category, subcategories } = props;
    const liRefs = useRef({});
    const elementRef = useRef();

    useTick(function() {
        subcategories.forEach(subcategory => {
            const id = subcategory.uuid;
            const anchor = Anchors.get(id);
            const element = liRefs.current[id];
            const screenPosition = anchor ? anchor.screenPosition : { x: 0, y: 0 };
            element.style.transform = `translate3d(${ screenPosition.x }px, ${ screenPosition.y }px, 0)`;
        });
    });

    function getSide(id) {
        const anchor = Anchors.get(id);
        const side = anchor ? anchor.side > 0 ? 'right' : 'left' : 'left';
        return side;
    }

    function buttonClickHandler(subcategory) {
        useStore.setState({ activeSubcategory: subcategory });
        Globals.webglApp.gotoSubcategory(category.id, subcategory.id);
        history.pushState({}, '', subcategory.slug);
    }

    function show() {
        console.log('show');
        gsap.to(elementRef.current, { duration: 1, opacity: 1, ease: 'sine.inOut' });
    }

    function hide() {
        console.log('hide');
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
                subcategories && subcategories.map((subcategory, index) => {
                    const highlight = subcategory.highlights.length > 0 ? subcategory.highlights[0] : false;
                    return (
                        <li key={ index } ref={ el => liRefs.current[subcategory.uuid] = el } className={ getSide(subcategory.uuid) }>
                            <button className="button" onClick={ () => buttonClickHandler(subcategory) }>
                                <div className="icon"></div>
                                <div className="content">
                                    <div className="category">
                                        <span>{ subcategory.name }</span>
                                    </div>
                                    { highlight &&
                                        <div className="highlight">
                                            <span className="highlight__value">{ highlight.value }</span>
                                            <span className="highlight__title">{ highlight.title }</span>
                                        </div>
                                    }
                                </div>
                            </button>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default forwardRef(LabelsSubcategories);
