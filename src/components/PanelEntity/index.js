// React
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Modules
import { Navigation } from 'swiper';
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
import useStore from '@/hooks/useStore';

function PanelEntity(props, ref) {
    /**
     * Data
     */
    const { entity, next, previous } = props;
    const { navigate, language } = useI18next();
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
     * Store
     */
    const [modalEntityIsOpen] = useStore(s => [s.modalEntityIsOpen]);
    /**
     * States
     */
    const [activeIndex, setActiveIndex] = useState(1);
    /**
     * References
     */
    const panelRef = useRef();
    const swiperRef = useRef(null);
    /**
     * Effects
     */
    useEffect(() => {
        useStore.setState({ modalEntityIsOpen: true });
    }, []);
    useEffect(() => {
        const timeline = new gsap.timeline();
        timeline.fromTo(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? 100 : -100 }, { xPercent: 0, ease: 'ease.easeout' });
        return () => {
            timeline.kill();
        };
    }, []);

    /**
     * Private
     */
    function clickHandler() {
        const timeline = new gsap.timeline({
            onComplete: () => {
                useStore.setState({ modalEntityIsOpen: false });
            },
        });
        timeline.to(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? 100 : -100, ease: 'ease.easein' });
        navigate(entity.slug.slice(0, entity.slug.lastIndexOf('/')));
    }
    return (
        <>
            <div ref={ panelRef } className="panel panel-entity" data-name="entity">
                <Scrollbar revert={ false }>
                    <ButtonClose onClick={ clickHandler } />
                    { /* <SequenceCharts charts={ sequenceCharts } /> */ }
                    <section className="section section-container hide-line">
                        <div className="points">
                            <div className="point"></div>
                            <div className="point"></div>
                            <div className="point"></div>
                        </div>
                        <div className="introduction">
                            <h1 className='h1'>{ entity.name }</h1>
                            { entity.description && <p className="p1">{ entity.description }</p> }
                        </div>
                    </section>
                    { entity.charts && <Charts charts={ entity.charts } /> }
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
                                            <SwiperSlide key={ relatedArticle.title } virtualIndex={ index }>
                                                <CardArticle article={ relatedArticle } />
                                            </SwiperSlide>
                                        )) }
                                    </Swiper>
                                </div>
                            </section>
                            <div className='pagination'>
                                <ButtonPagination name={ next.name } slug={ next.slug } direction='left'></ButtonPagination>
                                <ButtonPagination name={ next.name } slug={ next.slug } direction='right'></ButtonPagination>
                            </div>
                        </>
                    }
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelEntity;
