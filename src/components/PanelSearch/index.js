// React
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import ListSearchEntities from '@/components/ListSearchEntities';
import ListSearchMetrics from '@/components/ListSearchMetrics';
import ListSearchTags from '@/components/ListSearchTags';
import Scrollbar from '@/components/ScrollBar';
import ButtonSearch from '@/components/ButtonSearch';
import ButtonFilter from '../ButtonFilter/index';

// Config
import entitySearchFilterList from '@/configs/entitySearchFilterList';

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
    const contentRef = useRef();

    /**
     * State
     */
    const [allEntities, setAllEntities] = useState([]);
    const [filteredEntities, setFilteredEntities] = useState([]);

    const [filteredMetricsEntities, setFilteredMetricsEntities] = useState([]);

    const [allTags, setAllTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);

    const [inputSearch, setInputSearch] = useState('');

    const [filterType, setFilterType] = useState('entities');

    /**
     * Watchers
     */
    useEffect(() => {
        // Note: On locale switch kill all tweens and clear tween props
        // As the transform values are different between languages...
        reset();
        dispatchData();
    }, [language]);

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
        dispatchData();

        timelines.current.hide?.kill();
        timelines.current.show = new gsap.timeline();
        timelines.current.show.set(elRef.current, { autoAlpha: 1 }, 0);
        timelines.current.show.to(elRef.current, { duration: 1.1, x: '0%', ease: 'power3.out' });
        timelines.current.show.to(contentRef.current, { duration: 1, opacity: 1, ease: 'sine.inOut' }, 0);
        timelines.current.show.fromTo(contentRef.current, { x: '-15%' }, { duration: 1.3, x: '0%', ease: 'power3.out' }, 0);
        return timelines.current.show;
    }

    function hide() {
        const translateX = language === 'ar-QA' ? '-100%' : '100%';

        timelines.current.show?.kill();
        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 1, x: translateX, ease: 'power3.inOut' });
        timelines.current.hide.set(elRef.current, { autoAlpha: 1 });
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

    /**
     * Private
     */
    function dispatchData() {
        // Entities
        let entities = getAllEntities(props.year);
        entities = filterEntities(entities);

        const filteredEntities = entities.filter((item) => {
            if (inputSearch === '') return true;
            const acronym = (item.acronym || '').toString().toLowerCase();
            return item.name.toLowerCase().includes(inputSearch.toLowerCase()) || acronym.includes(inputSearch.toLowerCase());
        });

        setAllEntities(entities);
        setFilteredEntities(filteredEntities);

        // Tags
        const tags = getAllTags(props.year, entities);

        const filteredTags = tags.filter((item) => {
            if (inputSearch === '') return true;
            return item.name.toLowerCase().includes(inputSearch.toLowerCase());
        });

        setAllTags(entities);
        setFilteredTags(filteredTags);

        //Metrics
        const metrics = [];
        if (inputSearch !== '') {
            entities.forEach((entity) => {
                const charts = entity.charts;
                charts?.forEach((chart) => {
                    let title = null;

                    if (chart.type === 'kpiChart') {
                        chart.fields.forEach((chart) => {
                            title = chart.name;
                            if (title !== null && title.toLowerCase().includes(inputSearch.toLowerCase())) {
                                metrics.push({ entity, chart: { title } });
                            }
                        });
                    } else {
                        if (chart.title && Array.isArray(chart.title)) {
                            title = chart.title.map(part => part.value).join(' ');
                        } else if (chart.title && typeof chart.title === 'string') {
                            title = chart.title;
                        }

                        if (title !== null && title.toLowerCase().includes(inputSearch.toLowerCase())) {
                            metrics.push({ entity, chart });
                        }
                    }
                });
            });
        }

        metrics.sort((a, b) => {
            if (a.entity.name < b.entity.name) return -1;
            if (a.entity.name > b.entity.name) return 1;
            return 0;
        });

        setFilteredMetricsEntities(metrics);
    }

    function getAllEntities(year) {
        const entities = year.categories.map((category) => {
            return category.subcategories.map((subcategory) => {
                return subcategory.entities;
            });
        }).flat(2);

        entities.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        return entities;
    }

    function filterEntities(entities) {
        const filtered = entities.filter(entity => !entitySearchFilterList.includes(entity.name));
        return filtered;
    }

    function getAllTags(year, entities) {
        const tags = year.categories.map((category) => {
            return category.subcategories.map((subcategory) => {
                return subcategory.entities.map((entity) => {
                    return entity.tags;
                });
            });
        }).flat(3).filter(item => !!item);

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            tag.entities = entities.filter((entity) => {
                return entity.tags && entity.tags.includes(tag);
            });
        }

        tags.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        return tags;
    }

    /**
     * Private
     */
    function reset() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
        gsap.set(elRef.current, { clearProps: true });
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

            <div className="content" ref={ contentRef }>

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
                        <ButtonFilter name={ t('Metrics') } type="metrics" onClick={ onClickButtonFilter } active={ filterType === 'metrics' } />

                    </div>

                </div>

                <div className="search-results" data-name="search">

                    <Scrollbar revert={ false } name="panel-search">

                        { filterType === 'entities' ? <ListSearchEntities items={ filteredEntities } /> : filterType === 'tags' ? <ListSearchTags items={ filteredTags } /> : <ListSearchMetrics items={ filteredMetricsEntities } /> }

                    </Scrollbar>

                </div>

            </div>

        </div>
    );
}

export default forwardRef(PanelSearch);
