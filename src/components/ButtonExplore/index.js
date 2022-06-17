// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonExplore(props, ref) {
    /**
     * Datas
     */
    const { name, slug } = props;
    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-explore ${ props.direction } ${ props.className }` }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p className='p3'>{ name }</p>
        </Link>
    );
}

export default ButtonExplore;