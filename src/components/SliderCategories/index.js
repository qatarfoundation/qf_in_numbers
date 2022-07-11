// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

// Vendor
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';

// Utils
import Globals from '@/utils/Globals';

// CSS
import './style.scoped.scss';

// Components
import ListItemCategory from '../ListItemCategory/index';

function SliderCategories(props, ref) {
    /**
     * States
     */
    const [indexActiveCategory, setIndexActiveCategory] = useState(0);

    /**
     * Refs
     */
    const elRef = useRef(null);

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

        timelines.current.show = new gsap.timeline();
        timelines.current.show.to(elRef.current, { duration: 0.5,  autoAlpha: 1, ease: 'sine.inOut' });

        return timelines.current.show;
    }

    function hide() {
        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 0.5,  autoAlpha: 0, ease: 'sine.inOut' });

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
     * Watchers
     */
    useEffect(() => {
        const slug = props.categories[indexActiveCategory % props.categories.length].slug.split('/').slice(-1)[0];
        setTimeout(() => Globals.webglApp.gotoCategory(slug), 0);
        props.onChange(indexActiveCategory % props.categories.length);
    }, [indexActiveCategory]);

    return (
        <Swiper
            ref={ elRef }
            className="slider-categories"
            slidesPerView='auto'
            slideToClickedSlide={ true }
            loop={ true }
            centeredSlides={ true }
            on={ { reachEnd() { this.snapGrid = [...this.slidesGrid]; } } }
            onSlideChange={ (swiper) => setIndexActiveCategory(swiper.activeIndex) }
        >

            { props.categories[0] &&
                <SwiperSlide key={ `category-${ 0 }` } virtualIndex={ 0 }>

                    <ListItemCategory category={ props.categories[0] } />

                </SwiperSlide>
            }

            { props.categories[1] &&
                <SwiperSlide key={ `category-${ 1 }` } virtualIndex={ 1 }>

                    <ListItemCategory category={ props.categories[1] } />

                </SwiperSlide>
            }

            { props.categories[2] &&
                <SwiperSlide key={ `category-${ 2 }` } virtualIndex={ 2 }>

                    <ListItemCategory category={ props.categories[2] } />

                </SwiperSlide>
            }

        </Swiper>
    );
}

export default forwardRef(SliderCategories);
