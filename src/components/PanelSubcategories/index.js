// React
import React, { useEffect, useRef } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';
import gsap from 'gsap';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import Breadcrumbs from '@/components/Breadcrumbs';

// Hooks
import useStore from '@/hooks/useStore';

function PanelSubcategories(props, ref) {
    /**
     * Datas
     */
    const { subcategories } = props;
    const { language } = useI18next();
    /**
     * Store
     */
    const isOpen = useStore((state) => state.modalSubcategoriesIsOpen);
    /**
     * References
     */
    const panelRef = useRef();
    /**
     * Effects
     */
    useEffect(() => {
        const timeline = new gsap.timeline();
        timeline.fromTo(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? -100 : 100 }, { xPercent: 0, ease: 'ease.easeout' });
        return () => {
            timeline.kill();
        };
    }, []);
    /**
     * Private
     */
    function clickHandler(e, indexSubcategory, indexEntity) {
        const timeline = new gsap.timeline({
            onComplete: () => {
                if (indexSubcategory !== undefined) {
                    useStore.setState({ indexActiveSubcategory: indexSubcategory });
                }
                if (indexEntity !== undefined) {
                    useStore.setState({ indexActiveEntity: indexEntity });
                }
                useStore.setState({ modalSubcategoriesIsOpen: !isOpen });
            },
        });
        timeline.to(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? -100 : 100, ease: 'ease.easein' });
    }
    return (
        <>
            <div ref={ panelRef } className="panel panel-subcategories" data-name="subcategories">
                <div className="header">
                    <Breadcrumbs type="big" />
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
