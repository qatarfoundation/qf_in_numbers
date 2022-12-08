// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link, useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import gsap from 'gsap';

// Vendor
import CustomEase from '@/vendor/gsap/CustomEase';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import SideBreadcrumbs from '@/components/SideBreadcrumbs';

// Hooks
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';

function PanelMenu(props, ref) {
    /**
     * Props
     */
    const { year, category } = props;
    const categories = year.categories;

    const [activeCategory, setActiveCategory] = useState(category);

    /**
     * Hooks
     */
    const { language } = useI18next();
    const { t } = useTranslation();

    /**
     * Refs
     */
    const elRef = useRef();
    const containerRef = useRef();
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
        // timelines.current.show.set(elRef.current, { autoAlpha: 1 }, 0);
        // timelines.current.show.to(elRef.current, { duration: 1, y: '0%', ease: 'power3.out' });
        // timelines.current.show.to(elRef.current, { duration: 1.1, y: `${ 0 }%`, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1') }, 0);
        // timelines.current.show.to(containerRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);

        return timelines.current.show;
    }

    function hide() {
        const translateY = language === 'ar-QA' ? '-100%' : '100%';

        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();
        // timelines.current.hide.to(elRef.current, { duration: 1, y: translateY, ease: 'power3.inOut' }, 0);
        // timelines.current.hide.to(containerRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
        // timelines.current.hide.set(elRef.current, { autoAlpha: 0 });

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

    return (
        <div ref={ elRef } className="panel panel-menu" data-name="menu">
            <div ref={ containerRef } className="container">

                <div className="sidebar">
                    <ul className="list-categories">
                        {
                            categories.map(function(category, index) {
                                return (
                                    <li key={ index }>
                                        <button
                                            className={ `button button-category ${ category.id } ${ category.name === activeCategory?.name ? 'is-active' : '' }` }
                                            onClick={ () => setActiveCategory(category) }>
                                            { category.name }
                                        </button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    {
                        !activeCategory && <div className="select-category">{ t('Select a category') }</div>
                    }
                    <div className="copyright">{ t('Copyright') }</div>
                </div>

                <div className={ `content ${ activeCategory ? activeCategory.id : '' }` }>
                    <ul className="list-subcategories">
                        {
                            activeCategory?.subcategories.map((subcategory, index) => {
                                return (
                                    <li key={ `subcategory-${ index }` } className={ 'item-subcategories' }>
                                        <span className="title-subcategory h3">{ subcategory.name }</span>
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
                </div>

                { /*
                <div className="header">

                    <SideBreadcrumbs year={ props.year } category={ props.category } type="big" />
                    <ButtonClose onClick={ props.onClickClose } />

                </div>
                */ }

                { /*
                <div className="content">

                    <Scrollbar revert={ true } name="panel-subcategories">

                        <ul className="list-subcategories">
                            {
                                props.category.subcategories.map((subcategory, indexSubcategory) => {
                                    return (
                                        <li key={ `subcategory-${ indexSubcategory }` } className={ 'item-subcategories' }>

                                            <Link to={ subcategory.slug } className={ `button title-subcategory h3 ${ props.subcategory && props.subcategory.slug === subcategory.slug ? 'is-active' : '' }` }>
                                                { subcategory.name }
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
                 */ }

            </div>
        </div>
    );
}

export default forwardRef(PanelMenu);
