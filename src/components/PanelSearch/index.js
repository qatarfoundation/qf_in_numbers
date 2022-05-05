// React
import React from 'react';

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
    const isOpen = useStore((state) => state.modalSearchIsOpen);
    /**
     * Datas
     */
    const items = ['Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo', 'Sed faucibus faucibus amet', 'Id lacus in blandit placerat', 'Amet pretium sed leo'];
    /**
     * Private
     */
    function clickHandler() {
        useStore.setState({ modalSearchIsOpen: !isOpen });
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
                        <input type="text" className="input input-search p6" placeholder='search entity, metric or tag...' />
                        <ButtonSearch />
                    </div>
                </div>
                <div className="filters">
                    <ButtonFilter name="All entities" type="entities" />
                    <ButtonFilter name="Tags" type="tags" />
                </div>
                <Scrollbar revert={ false }>
                    <ListSearch items={ items } />
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelSearch;
