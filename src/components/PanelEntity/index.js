// React
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
import CustomEase from '@/vendor/gsap/CustomEase';

// Utils
import Scrolls from '@/utils/Scrolls';

// Modules
import { Swiper, SwiperSlide } from 'swiper/react';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import CardArticle from '@/components/CardArticle';
import ButtonArrow from '@/components/ButtonArrow';
import ButtonEntityPagination from '@/components/ButtonEntityPagination';
import Charts from '@/components/Charts';
import ButtonShare from '@/components/ButtonShare';
import ScrollIndicator from '@/components/ScrollIndicator';

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
    const [scrollOffset, setScrollOffset] = useState(0);

    /**
     * Refs
     */
    const elRef = useRef();
    const swiperRef = useRef(null);
    const titleRef = useRef();
    const introRef = useRef();
    const chartsListRef = useRef();
    const contentRef = useRef();
    const titleLinesRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
    });

    const entityShowScrollIndicator = useStore((state) => state.entityShowScrollIndicator);

    useEffect(() => {
        const id = location.hash;
        if (id) {
            const titleElement = document.body.querySelector(id);
            const top = titleElement ? titleElement.getBoundingClientRect().top : 0;
            setScrollOffset(top);
        }
    }, []);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        titleLinesRef.current = new SplitText(titleRef.current, {
            type: 'lines',
            linesClass: 'split-line',
        });

        useStore.setState({ entityShowScrollIndicator: Scrolls['panel-entity'].isVertical });
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

        timelines.current.show.to(elRef.current, { duration: 1.5, x: `${ 0 }%`, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1') }, 0);
        timelines.current.show.to(elRef.current, { duration: 0.8, alpha: 1, ease: 'sine.inOut' }, 0);

        timelines.current.show.to(contentRef.current, { duration: 1, opacity: 1, ease: 'sine.inOut' }, 0);

        timelines.current.show.to(titleLinesRef.current.lines, { opacity: 1, duration: 0.8, ease: 'none', stagger:0.11 }, .2);
        timelines.current.show.fromTo(titleLinesRef.current.lines, { x: '35%' }, { x:0, duration: 1.6, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1'), stagger:0.11 }, .2);

        timelines.current.show.to(introRef.current, { opacity: 1, duration: 0.7, ease: 'none' }, .45);
        timelines.current.show.fromTo(introRef.current, { x: 250 }, { x:0, duration: 1.4, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1')  }, .45);

        timelines.current.show.to(chartsListRef.current, { opacity: 1, duration: 0.6, ease: 'none' }, 0.63);
        timelines.current.show.fromTo(chartsListRef.current, { x: 160 }, { x:0, duration: 1.2, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1') }, .63);

        return timelines.current.show;
    }

    function hide() {
        const direction = language === 'ar-QA' ? -1 : 1;

        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();

        timelines.current.hide.to(elRef.current, { duration: 1, x: `${ 100 * direction }%`, ease: 'power3.inOut' }, 0);
        timelines.current.hide.to(contentRef.current, { duration: 0.5, opacity: 0, ease: 'sine.inOut' }, 0);

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

            <Scrollbar revert={ false } calcHeight={ false } name="panel-entity" scrollOffset={ scrollOffset }>

                <div className="content" ref={ contentRef }>

                    <ButtonClose to={ subcategory.slug } />

                    <ButtonShare title={ entity.name } />

                    { /* <SequenceCharts charts={ sequenceCharts } /> */ }

                    <section className="section section-container hide-line">
                        <div className="points">
                            <div className="point"></div>
                            <div className="point"></div>
                            <div className="point"></div>
                        </div>
                        <div className="introduction">
                            <h1 className='h1' ref={ titleRef }>{ entity.name }</h1>

                            { entityShowScrollIndicator &&
                                <ScrollIndicator />
                            }

                            { entity.description &&
                                <p className="p1" ref={ introRef }>
                                    { entity.description }
                                </p>
                            }
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
                        { previous && <ButtonEntityPagination name={ previous.name } slug={ previous.slug } direction='left'></ButtonEntityPagination> }
                        { next && <ButtonEntityPagination name={ next.name } slug={ next.slug } direction='right'></ButtonEntityPagination> }
                    </div>
                    }

                </div>

            </Scrollbar>

        </div>
    );
}

export default forwardRef(PanelEntity);
