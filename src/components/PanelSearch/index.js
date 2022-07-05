// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import ListSearch from '@/components/ListSearch';
import Scrollbar from '@/components/ScrollBar';
import ButtonSearch from '@/components/ButtonSearch';
import ButtonFilter from '../ButtonFilter/index';

// Hooks
import useStore from '@/hooks/useStore';

function PanelSearch(props, ref) {
    /**
     * Datas
     */
    const { language } = useI18next();
    const { t } = useTranslation();

    /**
     * References
     */
    const elRef = useRef();
    const timelines = useRef({
        show: null,
        hide: null,
    });

    /**
     * State
     */
    const [allEntities, setAllEntities] = useState([]);
    const [filteredEntities, setFilteredEntities] = useState([]);

    const [allTags, setAllTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);

    const [inputSearch, setInputSearch] = useState('');

    const [filterType, setFilterType] = useState('entities');

    /**
     * Watchers
     */
    useEffect(() => {
        dispatchData();
    }, [inputSearch]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        dispatchData();
    }

    function destroy() {

    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.to(elRef.current, { duration: 1, x: '0%', ease: 'power3.out' });
        return timelines.current.show;
    }

    function hide() {
        const translateX = language === 'ar-QA' ? '-105%' : '105%';

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 1, x: translateX, ease: 'power3.out' });
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
     * Private
     */
    function dispatchData() {
        // Entities
        const entities = getAllEntities(props.year);

        const filteredEntities = entities.filter((item) => {
            if (inputSearch === '') return true;
            return item.name.toLowerCase().includes(inputSearch.toLowerCase());
        });

        setAllEntities(entities);
        setFilteredEntities(filteredEntities);

        // Tags
        const tags = getAllTags(props.year);

        const filteredTags = tags.filter((item) => {
            if (inputSearch === '') return true;
            return item.name.toLowerCase().includes(inputSearch.toLowerCase());
        });

        setAllTags(entities);
        setFilteredTags(filteredTags);
    }

    function getAllEntities(year) {
        return year.categories.map((category) => {
            return category.subcategories.map((subcategory) => {
                return subcategory.entities;
            });
        }).flat(2);
    }

    function getAllTags(year) {
        return year.categories.map((category) => {
            return category.subcategories.map((subcategory) => {
                return subcategory.entities.map((entity) => {
                    return entity.tags;
                });
            });
        }).flat(3).filter(item => !!item);
    }

    /**
     * Handlers
     */
    function changeHandler(e) {
        setInputSearch(e.target.value);
    }

    function onClickButtonFilter(e) {
        setFilterType(e.currentTarget.dataset.type);
    }

    return (
        <div ref={ elRef } className="panel-search">

            <div className="header-container">

                <div className="header">

                    <p className='label h8'>{ t('Find data') }</p>
                    <ButtonClose onClick={ props.onClickClose } />

                </div>

                <div className="search">

                    <input type="text" className="input input-search p6" placeholder={ t('search entity, metric or tag...') } onChange={ changeHandler } />
                    <ButtonSearch />

                </div>

            </div>

            <div className="filters">

                <div className="filters-container">

                    <ButtonFilter name={ t('All entities') } type="entities" onClick={ onClickButtonFilter } active={ filterType === 'entities' } />
                    <ButtonFilter name={ t('Tags') } type="tags" onClick={ onClickButtonFilter } active={ filterType === 'tags' } />

                    <div className="active-indicator"></div>

                </div>

            </div>

            <Scrollbar revert={ false } data-name="search">

                <ListSearch items={ filterType === 'entities' ? filteredEntities : filteredTags } />

            </Scrollbar>

        </div>
    );
}

export default forwardRef(PanelSearch);
