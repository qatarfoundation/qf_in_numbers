// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';
import { Link } from 'gatsby-plugin-react-i18next';

function ButtonPagination(props, ref) {
    /**
     * Datas
     */
    const { name, slug } = props;
    return (
        <Link to={ slug } { ...props } className={ `button button-pagination ${ props.direction }` }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p className='p3'>{ name }</p>
        </Link>
    );
}

export default ButtonPagination;
