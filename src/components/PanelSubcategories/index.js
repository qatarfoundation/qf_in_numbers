// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import Breakcrumbs from '@/components/Breadcrumbs';

// Hooks
import useStore from '@/hooks/useStore';

function PanelSubcategories(props, ref) {
    /**
     * Datas
     */
    const { subcategories } = props;
    /**
     * Store
     */
    const isOpen = useStore((state) => state.modalSubcategoriesIsOpen);
    /**
     * Private
     */
    function clickHandler(e, indexSubcategory, indexEntity) {
        if (indexSubcategory !== undefined) {
            useStore.setState({ indexActiveSubcategory: indexSubcategory });
        }
        if (indexEntity !== undefined) {
            useStore.setState({ indexActiveEntity: indexEntity });
        }
        useStore.setState({ modalSubcategoriesIsOpen: !isOpen });
    }
    return (
        <>
            <div className="panel panel-subcategories" data-name="subcategories">
                <div className="header">
                    <Breakcrumbs />
                    <ButtonClose onClick={ clickHandler } />
                </div>
                <Scrollbar revert={ true }>
                    <ul className="list-subcategories">
                        {

                            subcategories.map((subcategory, indexSubcategory) => {
                                return (<li key={ `subcategory-${ indexSubcategory }` } className="item-subcategories">
                                    <p className='title-subcategory h5'>{ subcategory.name }</p>
                                    <ul className="list-entities">
                                        {
                                            subcategory.entities.map((entity, indexEntity) => {
                                                return (<li key={ `entity-${ indexEntity }` } className="item-entities">
                                                    <button className={ `button button-entity p4 ${ entity.isActive ? 'is-active' : '' }` } onClick={ (e) => clickHandler(e, indexSubcategory, indexEntity) }>
                                                        { entity.name }
                                                    </button>
                                                </li>);
                                            })
                                        }
                                    </ul>
                                </li>);
                            })
                        }
                    </ul>
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelSubcategories;
