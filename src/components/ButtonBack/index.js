// React
import React, { forwardRef, useRef } from 'react';
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

    /**
     * Refs
     */
    const elRef = useRef();

    const arrowContainerInitRef = useRef();
    const arrowContainerHoverRef = useRef();

    const timelines = useRef({
        show: null,
        hide: null,
        mouseenter: null,
        mouseleave: null,
    });

    return (
        <Link ref={ elRef } to={ slug ? slug : '' } { ...props } className={ `button button-back ${ props.className ? props.className : '' }` }>

            <div className="icon icon-arrow">

                <div ref={ arrowContainerInitRef } className="arrow-container arrow-container-init">
                    <Arrow className={ 'arrow arrow-init' } />
                </div>

                <div ref={ arrowContainerHoverRef } className="arrow-container arrow-container-hover">
                    <Arrow className={ 'arrow arrow-hover' } />
                </div>

                <div className="circle"></div>

            </div>

            <p className='p3'><span className="text text-init">{ name }</span><span className="text text-hover">{ name }</span></p>

        </Link>
    );
}

export default forwardRef(ButtonBack);
