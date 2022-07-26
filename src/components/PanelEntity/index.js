// React
import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';

// Modules
import { Swiper, SwiperSlide } from 'swiper/react';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import CardArticle from '@/components/CardArticle';
import ButtonArrow from '@/components/ButtonArrow';
import ButtonPagination from '@/components/ButtonPagination';
import Charts from '@/components/Charts';
import SequenceCharts from '@/components/SequenceCharts';

// Hooks
import { forwardRef } from 'react';

function PanelEntity(props, ref) {
    /**
     * Data
     */
    const { entity, subcategory, next, previous } = props;
    const { language } = useI18next();

    let sequenceCharts = [];
    if (entity.charts) {
        sequenceCharts = entity.charts.map(chart => {
            let type = chart.type.split('Chart')[0];
            type = type.charAt(0).toUpperCase() + type.slice(1);
            return type;
        });
    }

    if (entity.relatedArticles) {
        sequenceCharts.push('Related articles');
    }

    /**
     * States
     */
    const [activeIndex, setActiveIndex] = useState(1);

    /**
     * Refs
     */
    const elRef = useRef();
    const swiperRef = useRef(null);
    const titleRef = useRef();
    const introRef = useRef();
    const chartsListRef = useRef();

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

        timelines.current.show = new gsap.timeline({ delay: .1 });

        timelines.current.show.to(elRef.current, { duration: 1.5, x: `${ 0 }%`, ease: 'power3.out' }, 0);
        timelines.current.show.to(titleRef.current, { opacity: 1, duration: .4, ease: 'none' }, .4);
        timelines.current.show.fromTo(titleRef.current, { x: 100 }, { x: 0, duration: .6, ease: 'power2.out' }, .2);

        timelines.current.show.to(introRef.current, { opacity: 1, duration: .4, ease: 'none' }, .6);
        timelines.current.show.fromTo(introRef.current, { x: 100 }, { x: 0, duration: .6, ease: 'power2.out' }, .4);

        timelines.current.show.to(chartsListRef.current, { opacity: 1, duration: .4, ease: 'none' }, .8);
        return timelines.current.show;
    }

    function hide() {
        const direction = language === 'ar-QA' ? -1 : 1;

        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();

        timelines.current.hide.to(elRef.current, { duration: 1, x: `${ 100 * direction }%`, ease: 'power3.out' }, 0);

        return timelines.current.hide;
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    return (
        <div ref={ elRef } className="panel panel-entity" data-name="entity">

            <Scrollbar revert={ false }>

                <ButtonClose to={ subcategory.slug } />

                { /* <SequenceCharts charts={ sequenceCharts } /> */ }

                <section className="section section-container hide-line">
                    <div className="points">
                        <div className="point"></div>
                        <div className="point"></div>
                        <div className="point"></div>
                    </div>
                    <div className="introduction">
                        <h1 className='h1' ref={ titleRef }>{ entity.name }</h1>
                        { entity.description && <p className="p1" ref={ introRef }>{ entity.description }</p> }
                    </div>
                </section>

                <div className="charts-list" ref={ chartsListRef }>
                    { entity.charts && <Charts charts={ entity.charts } /> }
                </div>

                { entity.relatedArticles &&
                        <>
                            <section className="section">
                                <div className="articles">
                                    <h2 className="h8 section-container">Related articles</h2>
                                    <div className="slider-header">
                                        <div className="slider-pagination">
                                            <p className='p4'>{ `${ activeIndex } of ${ entity.relatedArticles.length }` }</p>
                                        </div>
                                        <div className="slider-navigation">
                                            {
                                                language !== 'ar-QA' ?
                                                    <>
                                                        <ButtonArrow className={ `${ activeIndex == 1 ? 'is-inactive' : '' }` } direction="left" onClick={ () => swiperRef.current.swiper.slidePrev() }  />
                                                        <ButtonArrow className={ `${ activeIndex == entity.relatedArticles.length ? 'is-inactive' : '' }` } direction="right" onClick={ () => swiperRef.current.swiper.slideNext() }  />
                                                    </> : <>
                                                        <ButtonArrow className={ `${ activeIndex == entity.relatedArticles.length ? 'is-inactive' : '' }` } direction="right" onClick={ () => swiperRef.current.swiper.slidePrev() }  />
                                                        <ButtonArrow className={ `${ activeIndex == 1 ? 'is-inactive' : '' }` } direction="left" onClick={ () => swiperRef.current.swiper.slideNext() }  />
                                                    </>
                                            }
                                        </div>
                                    </div>
                                    <Swiper
                                        ref={ swiperRef }
                                        className="slider"
                                        breakpoints={ {
                                            0: {
                                                slidesPerView: 1.25,
                                                spaceBetween: 16,
                                            },
                                            499: {
                                                slidesPerView: 2.5,
                                                spaceBetween: 30,
                                            },
                                        } }
                                        onSwiper={ (swiper) => setActiveIndex(swiper.activeIndex + 1) }
                                        onSlideChange={ (swiper) => setActiveIndex(swiper.activeIndex + 1) }
                                    >
                                        { entity.relatedArticles.map((relatedArticle, index) => (
                                            <SwiperSlide key={ `${ index }-${ relatedArticle.title }` } virtualIndex={ index }>
                                                <CardArticle article={ relatedArticle } />
                                            </SwiperSlide>
                                        )) }
                                    </Swiper>
                                </div>
                            </section>
                        </>
                }

                { (previous || next) &&
                    <div className={ `pagination ${ (previous && !next) ? 'left' : (next && !previous) ? 'right' : '' }` }>
                        { previous && <ButtonPagination name={ previous.name } slug={ previous.slug } direction='left'></ButtonPagination> }
                        { next && <ButtonPagination name={ next.name } slug={ next.slug } direction='right'></ButtonPagination> }
                    </div>
                }

            </Scrollbar>

        </div>
    );
}

export default forwardRef(PanelEntity);
