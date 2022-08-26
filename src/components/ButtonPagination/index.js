// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonEntityPagination(props, ref) {
    /**
     * Datas
     */
    const { name, slug } = props;

    const elRef = useRef();

    useEffect(() => {
        gsap.to(elRef.current, { duration: 0.3, autoAlpha: 1 });
    }, []);

    return (
        <Link ref={ elRef } to={ slug ? slug : '' } { ...props } className={ `button button-pagination ${ props.direction } ${ props.className ? props.className : '' }` }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p className='p3 label'>{ name }</p>
        </Link>
    );
}

export default ButtonEntityPagination;
