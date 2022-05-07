// React
import React, { useState, useRef, useEffect } from 'react';

// Modules
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// CSS
import './style.scoped.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import CardArticle from '@/components/CardArticle';
import ButtonArrow from '@/components/ButtonArrow';
import ButtonPagination from '@/components/ButtonPagination';

// Hooks
import useStore from '@/hooks/useStore';

function PanelEntity(props, ref) {
    /**
     * Datas
     */
    const { entity, next, previous } = props;
    /**
     * States
     */
    const [activeIndex, setActiveIndex] = useState(1);
    /**
     * References
     */
    const swiperRef = useRef(null);
    /**
     * Private
     */
    function clickHandler() {
        console.log('close entity');
    }
    return (
        <>
            <div className="panel panel-entity">
                <Scrollbar revert={ false }>
                    <ButtonClose onClick={ clickHandler } />
                    <section className="section section-container">
                        <div className="points">
                            <div className="point"></div>
                            <div className="point"></div>
                            <div className="point"></div>
                        </div>
                        <div className="introduction">
                            <h1 className='h1'>{ entity.name }</h1>
                            <p className="p1">{ entity.description }</p>
                        </div>
                    </section>
                    <section className="section">
                        <div className="articles">
                            <h2 className="h8 section-container">Related articles</h2>
                            <div className="slider-header">
                                <div className="slider-pagination">
                                    <p className='p4'>{ `${ activeIndex } of ${ entity.relatedArticles.length }` }</p>
                                </div>
                                <div className="slider-navigation">
                                    <ButtonArrow className={ `${ activeIndex == 1 ? 'is-inactive' : '' }` } direction="left" onClick={ () => swiperRef.current.swiper.slidePrev() }  />
                                    <ButtonArrow className={ `${ activeIndex == entity.relatedArticles.length ? 'is-inactive' : '' }` } direction="right" onClick={ () => swiperRef.current.swiper.slideNext() }  />
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
                                    <>
                                        <SwiperSlide key={ relatedArticle } virtualIndex={ index }>
                                            <CardArticle article={ relatedArticle } />
                                        </SwiperSlide>
                                    </>
                                )) }
                            </Swiper>
                        </div>
                    </section>
                    <div className='pagination'>
                        <ButtonPagination name={ next.name } slug={ next.slug } direction="left"></ButtonPagination>
                        <ButtonPagination name={ next.name } slug={ next.slug } direction="right"></ButtonPagination>
                    </div>
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelEntity;
