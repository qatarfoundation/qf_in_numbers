// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import gsap from 'gsap';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import SideBreadcrumbs from '@/components/SideBreadcrumbs';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

function PanelSubcategories(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();

    /**
     * Refs
     */
    const elRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
    });

    /**
     * Watchers
     */
    useEffect(() => {
        // Note: On locale switch kill all tweens and clear tween props
        // As the transform values are different between languages...
        reset();
    }, [language]);

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

        timelines.current.show.set(elRef.current, { autoAlpha: 1 }, 0);
        timelines.current.show.to(elRef.current, { duration: 1, x: '0%', ease: 'power3.out' });

        return timelines.current.show;
    }

    function hide() {
        const translateX = language === 'ar-QA' ? '100%' : '-100%';

        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();

        timelines.current.hide.to(elRef.current, { duration: 1, x: translateX, ease: 'power3.out' });
        timelines.current.hide.set(elRef.current, { autoAlpha: 0 });

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
     * Private
     */
    function reset() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
        gsap.set(elRef.current, { clearProps: true });
    }

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);

    function resizeHandler(e) {

    }

    /**
     * Utils
     */
    function romanize(num) {
        if (isNaN(num)) return NaN;
        const digits = String(+num).split('');
        const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        let roman = '';
        let i = 3;
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || '') + roman;
        }
        return Array(+digits.join('') + 1).join('M') + roman;
    }

    return (
        <div ref={ elRef } className="panel panel-subcategories" data-name="subcategories">

            <div className="header">

                <SideBreadcrumbs year={ props.year } category={ props.category } type="big" />
                <ButtonClose onClick={ props.onClickClose } />

            </div>

            <Scrollbar revert={ true }>

                <ul className="list-subcategories">
                    {
                        props.category.subcategories.map((subcategory, indexSubcategory) => {
                            return (
                                <li key={ `subcategory-${ indexSubcategory }` } className={ 'item-subcategories' }>

                                    <Link to={ subcategory.slug } className={ `button title-subcategory h3 ${ props.subcategory && props.subcategory.slug === subcategory.slug ? 'is-active' : '' }` }>
                                        { `${ romanize(indexSubcategory + 1) }. ${ subcategory.name }` }
                                    </Link>

                                    <ul className="list-entities">

                                        {
                                            subcategory.entities.map((entity, indexEntity) => {
                                                return (

                                                    <li key={ `entity-${ indexEntity }` } className="item-entities">

                                                        <Link to={ entity.slug } className="button button-entity p1">
                                                            { entity.name }
                                                        </Link>

                                                    </li>

                                                );
                                            })
                                        }

                                    </ul>

                                </li>
                            );
                        })
                    }
                </ul>

            </Scrollbar>

        </div>
    );
}

export default forwardRef(PanelSubcategories);
