// React
import React, { useEffect, useRef, useState } from 'react';

// CSS
import './style.scoped.scss';

// Modules
import { Swiper, SwiperSlide } from 'swiper/react';

// Components
import ListItemSubcategory from '@/components/ListItemSubcategory';
import LabelMainCategory from '../LabelMainCategory/index';
import ListItemCategory from '../ListItemCategory/index';

// Utils
import Globals from '@/utils/Globals';

// Hooks
import useStore from '@/hooks/useStore';

// Components

function SliderCategories(props, ref) {
    /**
     * Data
     */
    const { categories } = props;

    /**
     * States
     */
    const [indexActiveCategory, setIndexActiveCategory] = useState(0);

    /**
     * References
     */
    const swiperRef = useRef(null);

    /**
     * Effects
     */
    useEffect(() => {
        let slug = categories[indexActiveCategory % categories.length].slug;
        slug = slug.split('/').slice(-1)[0];
        setTimeout(() => Globals.webglApp.gotoCategory(slug), 0);
        useStore.setState({ currentCategory: categories[indexActiveCategory % categories.length] });
    }, [indexActiveCategory]);

    return (
        <Swiper
            ref={ swiperRef }
            className="slider-categories"
            slidesPerView='auto'
            slideToClickedSlide={ true }
            loop={ true }
            centeredSlides={ true }
            on={ { reachEnd() { this.snapGrid = [...this.slidesGrid]; } } }
            onSlideChange={ (swiper) => setIndexActiveCategory(swiper.activeIndex) }
        >
            { categories[0] &&
                <SwiperSlide key={ `category-${ 0 }` } virtualIndex={ 0 }>
                    <ListItemCategory category={ categories[0] } />
                </SwiperSlide>
            }

            { categories[1] &&
                <SwiperSlide key={ `category-${ 1 }` } virtualIndex={ 1 }>
                    <ListItemCategory category={ categories[1] } />
                </SwiperSlide>
            }

            { categories[2] &&
                <SwiperSlide key={ `category-${ 2 }` } virtualIndex={ 2 }>
                    <ListItemCategory category={ categories[2] } />
                </SwiperSlide>
            }
        </Swiper>
    );
}

export default SliderCategories;
