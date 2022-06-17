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
import useScrollList from './useScrollList';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';
import Breakpoints from '@/utils/Breakpoints';

// Components
import ListSubcategories from '@/components/ListSubcategories';
import LabelsEntities from '@/components/LabelsEntities';
import Scrollbar from '@/components/ScrollBar';
import SliderSubcategories from '@/components/SliderSubcategories';
import ButtonDiscover from '@/components/ButtonDiscover';
import ButtonScroll from '@/components/ButtonScroll';
import ModalSubcategories from '@/components/ModalSubcategories/index';
import ButtonPagination from '@/components/ButtonPagination/index';

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
    const [selectedSubcategory, setSelectedSubcategory] = useState(false);

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
        setSelectedSubcategory(splitPath.length - 1 == 3 ? true : false);
        let indexSubcategory = splitPath.length - 1 == 2 ? 0 : indexActiveSubcategory;
        const indexEntity = splitPath.length - 1 == 2 ? 0 : indexActiveEntity;
        const prefix = language === 'en-US' ? '' : `${ language }`;
        category.subcategories.forEach((subcategory, index) => {
            const slug = `${ prefix }${ subcategory.slug }`;
            if (path === slug) indexSubcategory = index;
        });
        useStore.setState({ indexActiveSubcategory: indexSubcategory, indexActiveEntity: indexEntity });
    }, [window.location.pathname]);

    useEffect(() => {
        const subcategory = category.subcategories[indexActiveSubcategory];
        if (selectedSubcategory) {
            useStore.setState({ currentSubcategory: subcategory });
            Globals.webglApp.gotoEntity(categorySlug, category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].slug);
            useStore.setState({ selectedEntity: category.subcategories[indexActiveSubcategory].entities[indexActiveEntity] });
            updateHistoryState(subcategory);
        } else {
            const slug = categorySlug.split('/').slice(-1)[0];
            Globals.webglApp.gotoSubcategory(slug, subcategory.name);
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
    // useScrollList(category, subcategory);

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
        return gsap.to(el.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
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

    function dragHandler() {
        const subcategory = category.subcategories[indexActiveSubcategory];
        useStore.setState({ currentCategory: category });
        useStore.setState({ currentSubcategory: subcategory });
        const slug = categorySlug.split('/').slice(-1)[0];
        useStore.setState({ currentSubcategory: subcategory });
        Globals.webglApp.gotoEntity(categorySlug, category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].slug);
        useStore.setState({ selectedEntity: category.subcategories[indexActiveSubcategory].entities[indexActiveEntity] });
        updateHistoryState(subcategory);
        useStore.setState({ selectedEntity: null });
        setSelectedSubcategory(true);
    }

    function clickHandlerTop() {
        const newIndexActiveEntity = indexActiveEntity - 1;
        if (newIndexActiveEntity >= 0) {
            useStore.setState({ indexActiveEntity: newIndexActiveEntity });
        } else {
            const newIndexActiveSubcategory = indexActiveSubcategory - 1;
            if (newIndexActiveSubcategory >= 0) {
                useStore.setState({ indexActiveEntity: category.subcategories[newIndexActiveSubcategory].entities.length - 1 });
                useStore.setState({ indexActiveSubcategory: newIndexActiveSubcategory });
            }
        }
    }

    function clickHandlerBottom() {
        const newIndexActiveEntity = indexActiveEntity + 1;
        const lengthEntities = category.subcategories[indexActiveSubcategory].entities.length - 1;
        if (newIndexActiveEntity <= lengthEntities) {
            useStore.setState({ indexActiveEntity: newIndexActiveEntity });
        } else {
            const newIndexActiveSubcategory = indexActiveSubcategory + 1;
            const lengthSubcategories = category.subcategories.length - 1;
            if (newIndexActiveSubcategory <= lengthSubcategories) {
                useStore.setState({ indexActiveEntity: 0 });
                useStore.setState({ indexActiveSubcategory: newIndexActiveSubcategory });
            }
        }
    }

    return (
        <div className="template-category" ref={ el } onMouseUp={ dragHandler }>
            {
                !selectedSubcategory ?
                    <>
                        <Swiper
                            ref={ swiperSubcategoriesRef }
                            className="slider-subcategories"
                            slidesPerView='auto'
                            slideToClickedSlide={ true }
                            onReachEnd={ (swiper) => {
                                swiper.snapGrid = [...swiper.slidesGrid];
                            } }
                            onSlideChange={ (swiper) => useStore.setState({ indexActiveSubcategory: swiper.activeIndex }) }
                            onInit={ (swiper) => {
                                swiper.slides.forEach(slide => {
                                    slide.style.width = slide.firstChild.getBoundingClientRect().width + 'px';
                                });
                            } }
                        >
                            { category.subcategories.map((subcategory, index) => (
                                <SwiperSlide key={ `subcategory-${ index }` } virtualIndex={ index }>
                                    <p className="h2">{ subcategory.name }</p>
                                </SwiperSlide>
                            )) }
                        </Swiper>
                        <ButtonScroll>Drag to select sub-branch</ButtonScroll>
                        <p className='p4 interaction-sentence'>Drag to select sub-branch</p>
                    </>
                    :
                    <>
                        <ButtonPagination  name='Back' slug={ window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) } direction='left' onClick={ () => useStore.setState({ currentSubcategory: undefined }) } />

                        <div className="slider-entities">
                            <div className="slider-navigation">
                                { breakpoints != 'small' && <button className={ `button button-navigation button-navigation-top ${ indexActiveSubcategory == 0 && indexActiveEntity == 0 ? 'is-inactive' : '' }` } onClick={ clickHandlerTop }></button> }
                                <ModalSubcategories subcategories={ category.subcategories } />
                                { breakpoints != 'small' && <button className={ `button button-navigation button-navigation-bottom ${ indexActiveSubcategory == category.subcategories.length - 1 && indexActiveEntity == category.subcategories[indexActiveSubcategory].entities.length - 1 ? 'is-inactive' : '' }` } onClick={ clickHandlerBottom }></button> }
                            </div>
                            <div className="slider-content">
                                <p className="slider-subcategory-title h3">{ category.subcategories[indexActiveSubcategory].name }</p>
                                { breakpoints == 'small' ?
                                    <ul className="list-entities">
                                        { category.subcategories[indexActiveSubcategory].entities.map((entity, index) => {
                                            return (<li key={ `entity-${ index }` } className={ `item-entities ${ index == indexActiveEntity ? 'is-active' : '' }` }>
                                                <p className="slider-entity-title p1">{ index + 1 }</p>
                                            </li>);
                                        }) }
                                    </ul>
                                    :
                                    <p className="slider-entity-title p1">{ category.subcategories[indexActiveSubcategory].entities[indexActiveEntity].name }</p>
                                }
                            </div>
                        </div>
                        <p className='p4 interaction-sentence'>Scroll to see more entities</p>
                    </>
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
