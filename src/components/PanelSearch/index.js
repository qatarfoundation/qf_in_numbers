// React
import React, { useEffect, useState } from 'react';

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
        useStore.setState({ modalSearchIsOpen: !isOpen, filterType: 'entities' });
    }
    function changeHandler(e) {
        setInputSearch(e.target.value);
    }
    return (
        <>
            <div className="panel panel-search">
                <div className="header-container">
                    <div className="header">
                        <p className='label h8'>Find data</p>
                        <ButtonClose onClick={ clickHandler } />
                    </div>
                    <div className="search">
                        <input type="text" className="input input-search p6" placeholder='search entity, metric or tag...' onChange={ changeHandler } />
                        <ButtonSearch />
                    </div>
                </div>
                <div className="filters">
                    <ButtonFilter name="All entities" type="entities" />
                    <ButtonFilter name="Tags" type="tags" />
                </div>
                <Scrollbar revert={ false } data-name="search">
                    <ListSearch items={ dynamicItems } />
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelSearch;
