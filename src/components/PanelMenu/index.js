// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link, useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import gsap from 'gsap';

// Vendor
import CustomEase from '@/vendor/gsap/CustomEase';

// CSS
import './style.scoped.scss';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Components
import Logo from '@/assets/icons/logo.svg';
import Scrollbar from '@/components/ScrollBar';
import ButtonClose from '@/components/ButtonClose';
import Arrow from '@/assets/icons/arrow.svg';

function PanelMenu(props, ref) {
    /**
     * Props
     */
    const { year, category } = props;
    const categories = year?.categories;

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
    const logoRef = useRef();
    const categoryHeaderRef = useRef();
    const timelines = useRef({
        show: null,
        hide: null,
        showEntities: null,
        hideEntities: null,
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
        timelines.current.show.to(elRef.current, { duration: 1, y: '0%', ease: 'power3.out' });
        timelines.current.show.to(elRef.current, { duration: 1.1, y: `${ 0 }%`, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1') }, 0);
        timelines.current.show.to(containerRef.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);

        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline({
            onComplete: () => {
                // hideEntities();
            },
        });
        timelines.current.hide.to(elRef.current, { duration: 1, y: '100%', ease: 'power3.inOut' }, 0);
        timelines.current.hide.to(containerRef.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
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
        gsap.set(elRef.current, { clearProps: true, x: 0 });
    }

    function showEntities() {
        timelines.current.hideEntities?.kill();

        const direction = language === 'ar-QA' ? 1 : -1;

        timelines.current.showEntities = new gsap.timeline();
        timelines.current.showEntities.to(containerRef.current, { duration: 0.6, x: `${ 100 * direction }vw`, ease: 'power1.inOut' }, 0);
        timelines.current.showEntities.to(logoRef.current, { duration: 0.3, autoAlpha: 0 }, 0);
        timelines.current.showEntities.to(categoryHeaderRef.current, { duration: 0.4, autoAlpha: 1 }, 0.2);
    }

    function hideEntities() {
        timelines.current.showEntities?.kill();

        timelines.current.hideEntities = new gsap.timeline();
        timelines.current.hideEntities.to(containerRef.current, { duration: 0.6, x: 0, ease: 'power1.inOut' }, 0);
        timelines.current.hideEntities.to(categoryHeaderRef.current, { duration: 0.3, autoAlpha: 0 }, 0);
        timelines.current.hideEntities.to(logoRef.current, { duration: 0.3, autoAlpha: 1 }, 0.2);
    }

    function buttonCategoryClickHandler(category) {
        setActiveCategory(category);
        if (Breakpoints.active('small')) {
            showEntities();
        }
    }

    function buttonBackClickHandler() {
        hideEntities();
    }

    return (
        <div ref={ elRef } className="panel panel-menu" data-name="menu">
            <div ref={ containerRef } className="container">

                <div className="sidebar">
                    <ul className="list-categories">
                        {
                            categories?.map(function(category, index) {
                                return (
                                    <li key={ index }>
                                        <button
                                            className={ `button button-category ${ category.id } ${ category.name === activeCategory?.name ? 'is-active' : '' }` }
                                            onClick={ () => buttonCategoryClickHandler(category) }>
                                            { category.name }
                                        </button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    { !activeCategory && !Breakpoints.active('small') && <div className="select-category">{ t('Select a category') }</div> }
                    <div className="copyright">{ t('Copyright') }</div>
                </div>

                <div className={ `content ${ activeCategory ? activeCategory.id : '' }` }>
                    <Scrollbar revert={ false } name="panel-subcategories">
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
                    </Scrollbar>
                </div>

            </div>

            <div className="header">
                <div className="logo" ref={ logoRef }>
                    <Logo />
                </div>
                <span className="summary">Summary</span>
                <ButtonClose onClick={ props.onClickClose } />

                <div className="category-header" ref={ categoryHeaderRef }>
                    <button className="button button-back" onClick={ buttonBackClickHandler }>
                        <Arrow className="button-back__arrow" />
                    </button>
                    { activeCategory && <span className="category-header__title">{ activeCategory.name }</span> }
                </div>

            </div>
        </div>
    );
}

export default forwardRef(PanelMenu);
