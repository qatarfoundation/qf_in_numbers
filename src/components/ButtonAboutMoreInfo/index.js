// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonAboutMoreInfo(props) {
    /**
     * Datas
     */
    const { name, link } = props;

    return (
        <a href={ link } target="_blank" className="button button-entity-pagination" rel="noreferrer">
            <div className="icon icon-arrow">
                <Arrow className="arrow" />
            </div>
            <p className='p3 label'>{ name }</p>
        </a>
    );
}

export default ButtonAboutMoreInfo;
