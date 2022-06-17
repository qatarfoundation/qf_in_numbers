// React
import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function Breakcrumbs(props) {
    /**
     * Store
     */
    const currentYear = useStore((state) => state.currentYear);
    const currentCategory = useStore((state) => state.currentCategory);
    const currentSubcategory = useStore((state) => state.currentSubcategory);
    const [modalEntityIsOpen] = useStore(s => [s.modalEntityIsOpen]);
    /**
     * State
     */
    const [isActiveCategory, setIsActiveCategory] = useState(false);
    /**
     * Private
     */
    const clickHandler = () => {
        setIsActiveCategory(!isActiveCategory);
    };
    return (
        <ul className='breadcrumbs'>
            { /* { currentYear &&
                <li  className='breadcrumb-year'>
                    <Link className="text-breadcrumb" to={ '/' + currentYear }>{ currentYear }</Link>
                </li>
            } */ }

            { currentCategory && currentCategory.slug && currentCategory.name ?
                !modalEntityIsOpen ?
                    <li className='breadcrumb-category'>
                        <Link className="text-breadcrumb" to={ currentCategory.slug } onClick={ () => {
                            useStore.setState({ currentSubcategory: undefined });
                        } }>{ currentCategory.name }</Link>
                    </li>
                    :
                    <li className='breadcrumb-category is-hide'>
                        <button className="button text-breadcrumb" onClick={ clickHandler }>...</button>
                        <Link className={ `text-breadcrumb ${ isActiveCategory ? 'is-active' : '' }` } to={ currentCategory.slug } onClick={ () => { useStore.setState({ currentSubcategory: undefined }); useStore.setState({ modalEntityIsOpen: false }); clickHandler(); } }>{ currentCategory.name }</Link>
                    </li>
                : ''
            }

            { currentSubcategory && currentSubcategory.slug && currentSubcategory.name &&
                <li className='breadcrumb-subcategory'>
                    <Link className="text-breadcrumb" to={ currentSubcategory.slug }>{ currentSubcategory.name }</Link>
                </li>
            }
        </ul>
    );
}

export default Breakcrumbs;
