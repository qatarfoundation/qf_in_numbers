// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonPagination(props, ref) {
    /**
     * Datas
     */
    const { name, slug } = props;

    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-entity-pagination ${ props.direction } ${ props.className ? props.className : '' }` }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p className='p3 label'>{ name }</p>
        </Link>
    );
}

export default ButtonPagination;
