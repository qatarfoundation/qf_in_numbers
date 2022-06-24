// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';

// CSS
import './style.scoped.scss';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';
import useWindowResizeObserver from '@/hooks/useWindowResizeObserver';
import useScrollList from './/useScrollList';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';
import Breakpoints from '@/utils/Breakpoints';

// Components
import LabelsEntities from '@/components/LabelsEntities';
import ButtonScroll from '@/components/ButtonScroll';
import ButtonPagination from '@/components/ButtonPagination';
import ButtonBack from '@/components/ButtonBack';
import SliderEntities from '@/components/SliderEntities';

function CategoryTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;
    /**
     * States
     */
    const [entities, setEntities] = useState([]);
    const [breakpoints, setBreakpoints] = useState(Breakpoints.current);
    const [isPresent, safeToRemove] = usePresence();
    const { navigate, path } = useI18next();
    const [selectedSubcategory, setSelectedSubcategory] = useState(true);

    /**
     * Store
     */
    const [enitity, currentSubcategory, indexActiveSubcategory, indexActiveEntity] = useStore((state) => [state.selectedEntity, state.currentSubcategory, state.indexActiveSubcategory, state.indexActiveEntity]);

    /**
     * Hooks
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const categorySlug = category.slug;
    const subcategory = data.subcategory ? data.subcategory[language] : null;
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        useStore.setState({ currentCategory: category });
        useStore.setState({ currentSubcategory: subcategory });
        const slug = category.slug.split('/').slice(-1)[0];
        if (subcategory) {
            Globals.webglApp.gotoSubcategory(slug, subcategory.name);
        } else {
            Globals.webglApp.gotoCategory(slug);
        }
    }, []);

    useEffect(() => {
        if (subcategory) setEntities(subcategory.entities);

        const handler = (name) => {
            const subcategories = category.subcategories;
            const subcategory = subcategories.filter(subcategory => subcategory.name === name)[0];
            if (subcategory) setEntities(subcategory.entities);
        };

        TreeDataModel.addEventListener('subcategory/active', handler);

        return () => {
            TreeDataModel.addEventListener('subcategory/active', handler);
        };
    }, []);

    useEffect(() => {
        const splitPath = window.location.pathname.split('/');
        if (language === splitPath[1]) splitPath.splice(1, 1);
        // console.log(splitPath);
        // setSelectedSubcategory(splitPath.length - 1 == 3 ? true : false);
        let indexSubcategory = splitPath.length - 1 == 2 ? 0 : indexActiveSubcategory;
        const indexEntity = splitPath.length - 1 == 2 ? 0 : indexActiveEntity;
        const prefix = language === 'en-US' ? '' : `${ language }`;
        category.subcategories.forEach((subcategory, index) => {
            const slug = `${ prefix }${ subcategory.slug }`;
            if (path === slug) indexSubcategory = index;
        });
        useStore.setState({ indexActiveSubcategory: indexSubcategory, indexActiveEntity: indexEntity });
    }, []);

    useEffect(() => {
        // console.log('Subcategory : ', indexActiveSubcategory, 'Entity : ', indexActiveEntity);
        const subcategory = category.subcategories[indexActiveSubcategory];
        if (selectedSubcategory) {
            useStore.setState({ currentSubcategory: subcategory });
            Globals.webglApp.gotoEntity(categorySlug, category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].slug);
            useStore.setState({ selectedEntity: category.subcategories[indexActiveSubcategory].entities[indexActiveEntity] });
            updateHistoryState(subcategory);
        } else {
            const slug = categorySlug.split('/').slice(-1)[0];
            // Globals.webglApp.gotoSubcategory(slug, subcategory.name);
            TreeDataModel.setSubcategory(subcategory.name);
        }
    }, [selectedSubcategory, useStore((state) => state.indexActiveSubcategory), useStore((state) => state.indexActiveEntity)]);

    useEffect(() => {
        useStore.setState({ currentCategory: category });
    }, useStore((state) => [state.indexActiveSubcategory, state.indexActiveEntity]));

    useEffect(() => {
        category.subcategories.forEach(subcategory => {
            subcategory.entities.forEach(entity => {
                entity.isActive = false;
            });
        });
        category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].isActive = true;
    }, [useStore((state) => state.indexActiveEntity)]);

    /**
     * Refs
     */
    const el = useRef();
    const swiperSubcategoriesRef = useRef();

    /**
     * Events
     */
    useWindowResizeObserver(resizeHandler);
    useScrollList(category);

    /**
     * Handlers
     */
    function resizeHandler() {
        resize();
    }

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    function resize() {
        setBreakpoints(Breakpoints.current);
    }

    function updateHistoryState(subcategory) {
        const prefix = language === 'en-US' ? '' : `/${ language }`;
        const slug = `${ prefix }${ subcategory.slug }`;
        window.history.replaceState({}, null, slug);
    }

    // function dragHandler() {
    //     gsap.to(el.current, {
    //         duration: 1, alpha: 0, ease: 'sine.inOut', onComplete: () => {
    //             const subcategory = category.subcategories[indexActiveSubcategory];
    //             useStore.setState({ currentCategory: category });
    //             useStore.setState({ currentSubcategory: subcategory });
    //             const slug = categorySlug.split('/').slice(-1)[0];
    //             useStore.setState({ currentSubcategory: subcategory });
    //             Globals.webglApp.gotoEntity(categorySlug, category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].slug);
    //             useStore.setState({ selectedEntity: category.subcategories[indexActiveSubcategory].entities[indexActiveEntity] });
    //             updateHistoryState(subcategory);
    //             useStore.setState({ selectedEntity: null });
    //             setSelectedSubcategory(true);
    //             gsap.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' });
    //         },
    //     });
    // }

    return (
        <div className="template-category" ref={ el }>
            {
                <>
                    <ButtonBack name='Back' slug={ '/' + year.year } onClick={ (e) => {
                        useStore.setState({ currentSubcategory: null });
                        useStore.setState({ indexActiveSubcategory: 0 });
                        setSelectedSubcategory(false);

                        // e.preventDefault();
                        // gsap.to(el.current, {
                        //     duration: 1, alpha: 0, ease: 'sine.inOut', onComplete: () => {
                        //         useStore.setState({ currentSubcategory: undefined });
                        //         setSelectedSubcategory(false);
                        //         window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
                        //         gsap.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' });
                        //     },
                        // });
                    } } />
                    <SliderEntities category={ category } />
                    { breakpoints == 'small' && <ButtonPagination className="explore" name={ breakpoints == 'small' ? 'Tap to explore' : 'Click to discover' } slug={ category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].slug } direction='right' /> }
                    <p className='p4 interaction-sentence'>Scroll to see more entities</p>
                </>
                // !selectedSubcategory ?
                //     <>
                //         <div className="container-categories" onMouseUp={ dragHandler }>
                //             <Swiper
                //                 ref={ swiperSubcategoriesRef }
                //                 className="slider-subcategories"
                //                 slidesPerView='auto'
                //                 slideToClickedSlide={ true }
                //                 onReachEnd={ (swiper) => {
                //                     swiper.snapGrid = [...swiper.slidesGrid];
                //                 } }
                //                 onSlideChange={ (swiper) => useStore.setState({ indexActiveSubcategory: swiper.activeIndex }) }
                //                 onInit={ (swiper) => {
                //                     swiper.slides.forEach(slide => {
                //                         slide.style.width = slide.firstChild.getBoundingClientRect().width + 'px';
                //                     });
                //                 } }
                //             >
                //                 { category.subcategories.map((subcategory, index) => (
                //                     <SwiperSlide key={ `subcategory-${ index }` } virtualIndex={ index }>
                //                         <p className="h2">{ subcategory.name }</p>
                //                     </SwiperSlide>
                //                 )) }
                //             </Swiper>
                //             <ButtonScroll>Drag to select sub-branch</ButtonScroll>
                //             <p className='p4 interaction-sentence'>Drag to select sub-branch</p>
                //         </div>
                //     </>
                //     :
                //     <>
                //         <ButtonBack  name='Back' slug={ window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) } onClick={ (e) => {
                //             e.preventDefault();
                //             gsap.to(el.current, {
                //                 duration: 1, alpha: 0, ease: 'sine.inOut', onComplete: () => {
                //                     useStore.setState({ currentSubcategory: undefined });
                //                     setSelectedSubcategory(false);
                //                     window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
                //                     gsap.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' });
                //                 },
                //             });
                //         } } />
                //         <SliderEntities category={ category } />
                //         { breakpoints == 'small' && <ButtonPagination className="explore" name={ breakpoints == 'small' ? 'Tap to explore' : 'Click to discover' } slug={ category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].slug } direction='right' /> }
                //         <p className='p4 interaction-sentence'>Scroll to see more entities</p>
                //     </>
            }
            { currentSubcategory &&
                <>
                    <LabelsEntities key={ indexActiveSubcategory } entities={ category.subcategories[indexActiveSubcategory].entities } />
                </>
            }
        </div>
    );
}

export default CategoryTemplate;

export const query = graphql`
    query ($language: String!) {
        locales: allLocale(filter: {language: {eq: $language}}) {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
    }
`;
