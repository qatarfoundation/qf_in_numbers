// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';
import { Link } from 'gatsby-plugin-react-i18next';

function ButtonPagination(props) {
    /**
     * Datas
     */
    const { name, slug } = props;
    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-discover ${ props.direction }` }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p>Tap to discover <br />{ name }</p>
        </Link>
    );
}

export default ButtonPagination;
