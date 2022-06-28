// React
import React, { useEffect, useRef, useState } from 'react';
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
    const panelRef = useRef();
    /**
     * Store
     */
    const [isOpen, allEntities, allTags, filterType] = useStore((state) => [state.modalSearchIsOpen, state.allEntities, state.allTags, state.filterType]);
    /**
     * State
     */
    const [staticItems, setStaticItems] = useState(allEntities);
    const [dynamicItems, setDynamicItems] = useState(allEntities);
    const [inputSearch, setInputSearch] = useState();
    /**
     * Effects
     */
    useEffect(() => {
        const timeline = new gsap.timeline();
        timeline.fromTo(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? 100 : -100 }, { xPercent: 0, ease: 'ease.easeout' });
        return () => {
            timeline.kill();
        };
    }, []);

    useEffect(() => {
        if (filterType == 'entities') {
            setStaticItems(allEntities);
            setDynamicItems(allEntities);
        } else if (filterType == 'tags') {
            setStaticItems(allTags);
            setDynamicItems(allTags);
        }
    }, [filterType]);

    useEffect(() => {
        if (inputSearch != undefined) {
            const filteredData = staticItems.filter((item) => {
                return item.value.toLowerCase().includes(inputSearch.toLowerCase());
            });
            setDynamicItems(filteredData);
        }
    }, [inputSearch]);
    /**
     * Private
     */
    function clickHandler() {
        const timeline = new gsap.timeline({ onComplete: () => { useStore.setState({ modalSearchIsOpen: !isOpen, filterType: 'entities' }); } });
        timeline.to(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? 100 : -100, ease: 'ease.easein' });
    }
    function changeHandler(e) {
        setInputSearch(e.target.value);
    }
    return (
        <>
            <div ref={ panelRef } className="panel panel-search">
                <div className="header-container">
                    <div className="header">
                        <p className='label h8'>{ t('Find data') }</p>
                        <ButtonClose onClick={ clickHandler } />
                    </div>
                    <div className="search">
                        <input type="text" className="input input-search p6" placeholder={ t('search entity, metric or tag...') } onChange={ changeHandler } />
                        <ButtonSearch />
                    </div>
                </div>
                <div className="filters">
                    <ButtonFilter name={ t('All entities') } type="entities" />
                    <ButtonFilter name={ t('Tags') } type="tags" />
                </div>
                <Scrollbar revert={ false } data-name="search">
                    <ListSearch items={ dynamicItems } />
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelSearch;
