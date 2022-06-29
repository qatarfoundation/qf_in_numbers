// React
import React, { useState } from 'react';
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

    const [isClicked, setIsClicked] = useState(false);

    function mouseEnterHandler() {
        Globals.webglApp.categoryMouseEnter(category);
    }

    function mouseLeaveHandler() {
        if (!isClicked) Globals.webglApp.categoryMouseLeave(category);
    }

    function clickHandler() {
        setIsClicked(true);
    }

    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-explore ${ props.direction } ${ props.className }` } onMouseEnter={ mouseEnterHandler } onMouseLeave={ mouseLeaveHandler } onClick={ clickHandler }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p className='p3'>{ name }</p>
        </Link>
    );
}

export default ButtonExplore;
