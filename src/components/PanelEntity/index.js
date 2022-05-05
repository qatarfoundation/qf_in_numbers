// React
import React from 'react';

// Modules
import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles

// CSS
import './style.scoped.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Components
import ButtonClose from '@/components/ButtonClose';
import ListYears from '@/components/ListYears';
import Scrollbar from '@/components/ScrollBar';

// Hooks
import useStore from '@/hooks/useStore';

function PanelEntity(props, ref) {
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
                    <section className="section">
                        <div className="points">
                            <div className="point"></div>
                            <div className="point"></div>
                            <div className="point"></div>
                        </div>
                        <div className="introduction">
                            <h1 className='h1'>Student Body</h1>
                            <p className="p1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                    </section>
                    <section className="section">
                        <div className="articles">
                            <h2 className="h8">Related articles</h2>
                            <Swiper
                            // install Swiper modules
                                modules={ [Navigation, Pagination, A11y] }
                                spaceBetween={ 50 }
                                slidesPerView={ 3 }
                                navigation
                                pagination={ { clickable: true } }
                                onSwiper={ (swiper) => console.log(swiper) }
                                onSlideChange={ () => console.log('slide change') }
                            >
                                <SwiperSlide>Slide 1</SwiperSlide>
                                <SwiperSlide>Slide 2</SwiperSlide>
                                <SwiperSlide>Slide 3</SwiperSlide>
                                <SwiperSlide>Slide 4</SwiperSlide>
                            ...
                            </Swiper>
                        </div>
                    </section>
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelEntity;
