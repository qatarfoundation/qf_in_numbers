// React
import React, { useRef } from 'react';

// Modules
import { Swiper, SwiperSlide } from 'swiper/react';

// CSS
import './style.scoped.scss';
import 'swiper/css';

// Components
import ListItemSubcategory from '@/components/ListItemSubcategory';

// Components

function SliderSubcategories(props, ref) {
    /**
     * Data
     */
    const { category, subcategories } = props;
    /**
     * References
     */
    const swiperRef = useRef(null);

    return (
        <Swiper
            ref={ swiperRef }
            className="slider-subcategories"
            slidesPerView='auto'
            slideToClickedSlide={ true }
            spaceBetween={ 8 }
        >
            { subcategories.map((item, index) => (
                <SwiperSlide key={ `subcategory-${ index }` } virtualIndex={ index }>
                    <ListItemSubcategory category={ category } subcategory={ item } />
                </SwiperSlide>
            )) }
        </Swiper>
    );
}

export default SliderSubcategories;
