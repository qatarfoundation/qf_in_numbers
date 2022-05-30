// React
import React, { useRef } from 'react';

// CSS
import './style.scoped.scss';

// Modules
import { Swiper, SwiperSlide } from 'swiper/react';

// Components
import ListItemSubcategory from '@/components/ListItemSubcategory';
import LabelMainCategory from '../LabelMainCategory/index';
import ListItemCategory from '../ListItemCategory/index';

// Components

function SliderCategories(props, ref) {
    /**
     * Data
     */
    const { categories } = props;

    /**
     * References
     */
    const swiperRef = useRef(null);

    return (
        <Swiper
            ref={ swiperRef }
            className="slider-categories"
            slidesPerView='auto'
            slideToClickedSlide={ true }
            spaceBetween={ 16 }
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
