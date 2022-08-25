// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

// Vendor
import { gsap } from 'gsap';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

// Utils
import Globals from '@/utils/Globals';

// Hooks
import useStore from '@/hooks/useStore';

// CSS
import './style.scoped.scss';

// Components
import ListItemCategory from '../ListItemCategory/index';

function SliderCategories(props, ref) {
    /**
     * States
     */
    const [indexActiveCategory, setIndexActiveCategory] = useState(null);

    /**
     * Refs
     */
    const elRef = useRef(null);

    const timelines = useRef({
        show: null,
        hide: null,
    });

    /**
     * Store
     */
    const isCategorySelected = useStore((state) => state.isCategorySelected);

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
        if (indexActiveCategory === null) return;
        const slug = props.categories[indexActiveCategory % props.categories.length].slug.split('/').slice(-1)[0];
        Globals.webglApp.selectCategory(slug);
        props.onChange(indexActiveCategory % props.categories.length);
    }, [indexActiveCategory]);

    // Swipeeee
    const [touchstartX, setTouchstartX] = useState(0);
    const [touchendX, setTouchendX] = useState(0);

    function checkDirection() {
        const delta = touchendX - touchstartX;
        console.log(delta);

        if (touchendX < touchstartX) {
            // Swipe left
            elRef.current.swiper.slideNext();
        }
        if (touchendX > touchstartX) {
            // Swipe right
            elRef.current.swiper.slidePrev();
        }
    }

    // useEffect(() => {
    //     function touchStartHandler(e) {
    //         setTouchstartX(e.changedTouches[0].screenX);
    //     }

    //     function touchEndHandler(e) {
    //         setTouchendX(e.changedTouches[0].screenX);
    //         checkDirection();
    //     }

    //     window.addEventListener('touchstart', touchStartHandler);
    //     window.addEventListener('touchend', touchEndHandler);

    //     return () => {
    //         window.removeEventListener('touchstart', touchEndHandler);
    //         window.removeEventListener('touchend', touchEndHandler);
    //     };
    // }, [touchstartX, touchendX]);

    return (
        <Swiper
            ref={ elRef }
            className={ `slider-categories ${ isCategorySelected ? 'enabled' : 'disabled' }` }
            slidesPerView='auto'
            slideToClickedSlide={ true }
            loop={ false }
            centeredSlides={ true }
            on={ { reachEnd() { this.snapGrid = [...this.slidesGrid]; } } }
            onSlideChange={ (swiper) => {
                setIndexActiveCategory(swiper.activeIndex);
                useStore.setState({ isCategorySelected: true });
            } }
            onClick={ (swiper) => {
                if (!isCategorySelected && swiper.activeIndex === 0) {
                    setIndexActiveCategory(swiper.activeIndex);
                    useStore.setState({ isCategorySelected: true });
                }
            } }
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
