// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonExplore(props) {
    /**
     * Datas
     */
    const { name, slug, category } = props;

    function mouseEnterHandler() {
        Globals.webglApp.categoryMouseEnter(category);
    }

    function mouseLeaveHandler() {
        Globals.webglApp.categoryMouseLeave(category);
    }

    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-explore ${ props.direction } ${ props.className }` } onMouseEnter={ mouseEnterHandler } onMouseLeave={ mouseLeaveHandler }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p className='p3'>{ name }</p>
        </Link>
    );
}

export default ButtonExplore;
