// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonBack(props, ref) {
    /**
     * Datas
     */
    const { name, slug } = props;
    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-back ${ props.className ? props.className : '' }` }>
            <div className="icon icon-arrow">
                <Arrow className={ 'arrow arrow-init' } />
                <Arrow className={ 'arrow arrow-hover' } />
            </div>
            <p className='p3'><span className="text text-init">{ name }</span><span className="text text-hover">{ name }</span></p>
        </Link>
    );
}

export default ButtonBack;
